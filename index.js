var choo = require('choo')
var app = choo({ hash: false })
var middleware = require('./lib/prismic-middleware')
var REPOSITORY = 'https://yennengaprogress.cdn.prismic.io/api/v2'

app.state.origin = process.env.NODE_ENV === 'development'
  ? 'http://localhost:8080'
  : 'https://' + process.env.HOST

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  app.use(require('choo-devtools')())
  app.use(require('choo-service-worker/clear')())
}

app.use(require('./stores/reset'))
app.use(require('./stores/ui'))
app.use(require('./stores/join'))
app.use(require('./stores/navigation'))
app.use(require('./stores/prismic')({ repository: REPOSITORY, middleware }))
app.use(require('choo-meta')({ origin: app.state.origin }))
app.use(require('choo-service-worker')('/sw.js'))

app.route('/', require('./views/home'))
app.route('/join', require('./views/join'))
app.route('/donate', require('./views/donate'))
app.route('/news', require('./views/news-listing'))
app.route('/news/:uid', require('./views/news'))
app.route('/projects', require('./views/project-listing'))
app.route('/projects/:uid', require('./views/project'))
app.route('/:uid', require('./views/page'))

try {
  module.exports = app.mount('body')
  // remove parse guard added in header
  window.onerror = null
} catch (err) {
  if (typeof window !== 'undefined') {
    document.documentElement.removeAttribute('scripting-enabled')
    document.documentElement.setAttribute('scripting-initial-only', '')
  }
}
