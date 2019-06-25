var assert = require('assert')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Component = require('choo/component')
var asElement = require('prismic-element')
var error = require('./error')
var header = require('./header')
var footer = require('./footer')
var player = require('../embed/player')
var PrismicToolbar = require('../prismic-toolbar')
var { i18n, asText, memo, resolve, metaKey, className, HTTPError } = require('../base')

var text = i18n()

module.exports = View

// view constructor doubles as view factory
// if not called with the `new` keyword it will just return a wrapper function
// (str|fn, fn?) -> View|fn
function View (view, meta) {
  if (!(this instanceof View)) return createView(view, meta)
  var id = view
  assert(typeof id === 'string', 'View: id should be type string')
  Component.call(this, id)
  this.createElement = createView(this.createElement, this.meta)
}

View.prototype = Object.create(Component.prototype)
View.prototype.constructor = View
View.prototype.meta = function () {
  throw new Error('View: meta should be implemented')
}
View.createView = createView
View.createClass = createClass

function createClass (Class, id) {
  return function (state, emit) {
    return state.cache(Class, id).render(state, emit)
  }
}

function createView (view, meta) {
  return function (state, emit) {
    var self = this

    return state.prismic.getSingle('website', function (err, doc) {
      var children
      var title = doc ? asText(doc.data.title) : null

      try {
        if (err) throw HTTPError(500, err)
        children = view.call(self, state, emit)
        let next = meta ? meta.call(self, state) : {}

        if (next && next.title) {
          next['og:title'] = next.title
          if (next.title !== title) next.title = `${next.title} – ${title}`
        }

        var defaults = {
          title: doc ? title : text`Loading`,
          description: doc ? asText(doc.data.description) : null
        }

        if (doc && doc.data.featured_image && doc.data.featured_image.url) {
          defaults['og:image'] = doc.data.featured_image.url
          defaults['og:image:width'] = doc.data.featured_image.dimensions.width
          defaults['og:image:height'] = doc.data.featured_image.dimensions.height
        }

        emit('meta', Object.assign(defaults, next))
      } catch (err) {
        err.status = state.offline ? 503 : err.status || 500
        children = error(err, state.href)
        emit('meta', { title: `${text`Oops`} – ${title}` })
      }

      var menu = memo(function () {
        if (!doc) return []
        return doc.data.menu.map(link).filter(Boolean)
      }, [doc && doc.id, 'menu'])

      var sections = memo(function () {
        if (!doc) return []
        return doc.data.footer.map(function (slice) {
          return {
            heading: asText(slice.primary.heading),
            items: slice.items.map(link)
          }
        })
      }, [doc && doc.id, 'footer'])

      return html`
        <body class="${className('View', { 'View--covered': state.ui.isCovered })}" id="view">
          <script type="application/ld+json">${raw(JSON.stringify(linkedData(state)))}</script>
          ${header(menu, state.href)}
          ${children}
          ${footer(doc ? asElement(doc.data.contact, resolve) : null, doc ? asElement(doc.data.support, resolve) : null, sections)}
          ${player.render()}
          ${state.cache(PrismicToolbar, 'prismic-toolbar').placeholder(state.href)}
        </body>
      `

      // format document as schema-compatible linked data table
      // obj -> obj
      function linkedData (state) {
        return {
          '@context': 'http://schema.org',
          '@type': 'Organization',
          name: title,
          url: state.origin,
          logo: state.origin + '/share.png'
        }
      }
    })

    // construct menu branch
    // obj -> obj
    function link (props) {
      if (!props.link.id || props.link.isBroken) return null
      var href = resolve(props.link)
      if (props.anchor) href += `#${props.anchor}`
      return Object.assign({}, props, {
        href: href,
        onclick: onclick,
        label: props.label || asText(props.link.data.title)
      })

      function onclick (event) {
        if (metaKey(event)) return
        emit('pushState', event.currentTarget.href, {
          partial: props.link,
          preventScroll: Boolean(props.anchor)
        })
        event.preventDefault()
      }
    }
  }
}
