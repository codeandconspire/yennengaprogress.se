if (!process.env.NOW) require('dotenv/config')

var jalla = require('jalla')
var dedent = require('dedent')
var body = require('koa-body')
var mailgun = require('mailgun-js')
var compose = require('koa-compose')
var { get, post } = require('koa-route')
var asElement = require('prismic-element')
var Prismic = require('prismic-javascript')
var purge = require('./lib/purge')
var imageproxy = require('./lib/cloudinary-proxy')
var { resolve, asText } = require('./components/base')

var REPOSITORY = 'https://yennengaprogress.cdn.prismic.io/api/v2'
var NOTIFICATION_RECEIVER = process.env.NODE_ENV === 'development'
  ? 'null@codeandconspire.com'
  : 'stina@yennengaprogress.se'
var MAILGUN_DOMAIN = 'mg.yennengaprogress.se'
var MAILGUN_HOST = 'api.eu.mailgun.net'

var app = jalla('index.js', {
  sw: 'sw.js',
  serve: Boolean(process.env.NOW) && process.env.NODE_ENV === 'production'
})

app.use(post('/api/join', compose([body({ multipart: true }), async function (ctx, next) {
  var { name, email, info, linkedin, skill } = ctx.request.body

  try {
    ctx.assert(name && email && info, 400)

    var origin = process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080'
      : 'https://' + process.env.npm_package_now_alias
    var api = await Prismic.api(REPOSITORY, { req: ctx.req })
    var message = await api.getByUID('email', 'join')
    var notification = await api.getByUID('email', 'notification')
    var client = mailgun({
      apiKey: process.env.MAILGUN_KEY,
      domain: MAILGUN_DOMAIN,
      host: MAILGUN_HOST
    })

    await Promise.all([
      client.messages().send({
        from: `${message.data.sender_name} <${message.data.sender_email}>`,
        to: email,
        subject: format(asText(message.data.subject)),
        text: format(asText(message.data.body)),
        html: format(asElement(message.data.body, (doc) => origin + resolve(doc)))
      }),
      client.messages().send({
        from: `${notification.data.sender_name} <${notification.data.sender_email}>`,
        to: NOTIFICATION_RECEIVER,
        subject: format(asText(notification.data.subject)),
        text: format(asText(notification.data.body)),
        html: format(asElement(notification.data.body, (doc) => origin + resolve(doc)))
      })
    ])

    if (ctx.accepts('html')) {
      ctx.redirect('back')
    } else {
      ctx.body = {}
      ctx.type = 'application/json'
    }
  } catch (err) {
    app.emit('error', err)
    if (ctx.accepts('html')) {
      ctx.redirect('back')
    } else {
      ctx.type = 'application/json'
      ctx.status = err.status || 500
      ctx.body = { error: err.message }
    }
  }

  function format (str) {
    if (Array.isArray(str)) str = str.join('')
    str = str.toString()
    return str
      .replace(/{{\s?name\s?}}/ig, name)
      .replace(/{{\s?info\s?}}/ig, info)
      .replace(/{{\s?email\s?}}/ig, email)
      .replace(/{{\s?skill\s?}}/ig, skill)
      .replace(/{{\s?linkedin\s?}}/ig, linkedin)
  }
}])))

/**
 * Proxy image transform requests to Cloudinary
 * By running all transforms through our own server we can cache the response
 * on our edge servers (Cloudinary) saving on costs. Seeing as Cloudflare has
 * free unlimited cache and Cloudinary does not, we will only be charged for
 * the actual image transforms, of which the first 25 000 are free
 */
app.use(get('/media/:type/:transform/:uri(.+)', async function (ctx, type, transform, uri) {
  if (ctx.querystring) uri += `?${ctx.querystring}`
  var stream = await imageproxy(type, transform, uri)
  var headers = ['etag', 'last-modified', 'content-length', 'content-type']
  headers.forEach((header) => ctx.set(header, stream.headers[header]))
  ctx.set('Cache-Control', `public, max-age=${60 * 60 * 24 * 365}`)
  ctx.body = stream
}))

/**
 * Purge Cloudflare cache whenever content is published to Prismic
 */
app.use(post('/api/prismic-hook', compose([body(), function (ctx) {
  var secret = ctx.request.body && ctx.request.body.secret
  ctx.assert(secret === process.env.PRISMIC_SECRET, 403, 'Secret mismatch')
  return queried().then(function (urls) {
    return new Promise(function (resolve, reject) {
      purge(urls.concat('/sw.js'), function (err, response) {
        if (err) return reject(err)
        ctx.type = 'application/json'
        ctx.body = {}
        resolve()
      })
    })
  })
}])))

/**
 * Handle Prismic previews
 * Capture the preview token, setting it as a cookie and redirect to the
 * document being previewed. The Prismic library will pick up the cookie and use
 * it for fetching content.
 */
app.use(get('/api/prismic-preview', async function (ctx) {
  var token = ctx.query.token
  var api = await Prismic.api(REPOSITORY, { req: ctx.req })
  var href = await api.previewSession(token, resolve, '/')
  var expires = app.env === 'development'
    ? new Date(Date.now() + (1000 * 60 * 60 * 12))
    : new Date(Date.now() + (1000 * 60 * 30))

  ctx.set('Cache-Control', 'no-cache, private, max-age=0')
  ctx.cookies.set(Prismic.previewCookie, token, {
    expires: expires,
    httpOnly: false,
    path: '/'
  })
  ctx.redirect(href)
}))

/**
 * Disallow robots anywhere but in production
 */
app.use(get('/robots.txt', function (ctx, next) {
  ctx.type = 'text/plain'
  ctx.body = dedent`
    User-agent: *
    Disallow: ${app.env === 'production' ? '' : '/'}
  `
}))

/**
 * Set cache headers for HTML pages
 * By caching HTML on our edge servers (Cloudflare) we keep response times and
 * hosting costs down. The `s-maxage` property tells Cloudflare to cache the
 * response for a month whereas we set the `max-age` to cero to prevent clients
 * from caching the response
 */
app.use(function (ctx, next) {
  if (!ctx.accepts('html')) return next()
  ctx.append('Link', '<https://use.typekit.net/ugl4huw.css>; rel=preload; crossorigin=anonymous; as=style;')
  var previewCookie = ctx.cookies.get(Prismic.previewCookie)
  if (previewCookie) {
    ctx.set('Cache-Control', 'no-cache, private, max-age=0')
  } else if (process.env.NODE_ENV !== 'development') {
    ctx.set('Cache-Control', `max-age=0, s-maxage=${60 * 60 * 24 * 7}`)
  }

  return next()
})

/**
 * Purge Cloudflare cache when starting production server
 */
app.listen(process.env.PORT || 8080, function () {
  if (process.env.NOW && app.env === 'production') {
    queried().then(function (urls) {
      purge(urls.concat('/sw.js'), function (err) {
        if (err) app.emit('error', err)
      })
    })
  }
})

// get urls for all queried pages
// () -> Promise
async function queried () {
  var urls = []
  var api = await Prismic.api(REPOSITORY)

  var [projects, news] = await Promise.all([api.query(
    Prismic.Predicates.at('document.type', 'news'),
    { pageSize: 10 }
  ), api.query(
    Prismic.Predicates.at('document.type', 'news'),
    { pageSize: 9 }
  )])

  for (let i = 0; i < projects.total_pages; i++) {
    urls.push(`/projects?page=${i + 1}`)
  }

  for (let i = 0; i < news.total_pages; i++) {
    urls.push(`/news?page=${i + 1}`)
  }

  return urls
}
