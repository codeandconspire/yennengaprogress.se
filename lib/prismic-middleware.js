// page types which all have featured fields used for links
var types = [
  'homepage', 'join', 'project_listing', 'news_listing', 'project', 'news',
  'page', 'donate'
]
var common = ['title', 'description', 'label', 'cta', 'image', 'featured_image']

module.exports = middleware

function middleware (predicates, opts) {
  var fetchLinks = opts.fetchLinks = (opts.fetchLinks || [])

  for (let i = 0, len = types.length; i < len; i++) {
    fetchLinks.push(...common.map((field) => types[i] + '.' + field))
  }

  return transform
}

function transform (err, response) {
  if (err) throw err
  return sanitize(response)
}

function sanitize (src) {
  var keys = Object.keys(src)
  var initial = Array.isArray(src) ? [] : {}
  return keys.reduce(function (target, key) {
    // exclude oembed html as instagram embeds are a complete shit show
    if ('embed_url' in src && key === 'html') return target
    if (src[key] && typeof src[key] === 'object') {
      target[key] = sanitize(src[key])
    } else {
      target[key] = src[key]
    }
    return target
  }, initial)
}
