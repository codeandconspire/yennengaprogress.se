var assert = require('assert')
var html = require('choo/html')
var raw = require('choo/html/raw')
var Component = require('choo/component')
var error = require('./error')
var PrismicToolbar = require('../prismic-toolbar')
var { i18n, asText, memo, resolve, className, HTTPError } = require('../base')

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
          next.title = `${next.title} – ${title}`
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

      // var footer = memo(function () {
      //   if (!doc) return null
      //   var links = doc.data.footer.map((slice) => link(slice.primary))
      //   return {
      //     contact: asText(doc.data.contact),
      //     menu: links.filter(Boolean)
      //   }
      // }, [doc && doc.id, 'footer'])

      return html`
        <body class="View ${state.ui.openNavigation ? 'is-overlayed' : ''}" id="view">
          <script type="application/ld+json">${raw(JSON.stringify(linkedData(state)))}</script>
          <header class="View-header u-container">
            <svg class="View-logo" width="198" height="66" viewBox="0 0 198 66">
              <g fill="#BA6740" fill-rule="nonzero">
                <path d="M17.9 30V.6h15.7v4.5h-11v8h9.7v4.4h-9.7v8h11V30zM47.4 30l-6.8-16.9V30h-4.4V.6h4.4l6.8 17.2V.6h4.5V30zM65.8 30l-7-16.9V30h-4.3V.6h4.4l6.9 17.2V.6h4.4V30zM72.8 30V.6h15.8v4.5H77.5v8h9.7v4.4h-9.7v8h11V30zM102.4 30l-6.8-16.9V30H91V.6h4.5l6.8 17.2V.6h4.4V30zM120.7 17.5h-3.4v-4.3h7.8v8.7c0 5-2.6 8.6-7.8 8.6-6.3 0-7.9-4.7-7.9-8.6V8.7c0-5 2.6-8.6 7.9-8.6 6.6 0 7.8 4.6 7.8 8.6v.5h-4.4v-.5c0-1.2 0-4.3-3.4-4.3s-3.4 3-3.4 4.3v13.1c0 1.3 0 4.4 3.4 4.4 3.3 0 3.4-3.1 3.4-4.3v-4.4zM139 30l-1-5.8h-5.8l-.8 5.8h-4.5L131.5.6h7.3l4.6 29.4H139zm-6.1-10h4.5l-2.2-15-2.3 15zM62.3 36c6 0 8.5 4.3 8.5 8.3 0 5.9-3.3 9.4-8.2 9.4h-3v11.6H55V36h7.2zm-2.8 13h2.6c4.2 0 4.3-3.4 4.3-4.6 0-1-.5-4-4-4h-2.9V49zM84.6 52.4l3.9 12.9h-4.8l-3.5-11.8h-3v11.8h-4.5V36H80c6 0 8.6 4.2 8.6 8.4 0 3.8-1.4 6.6-4 8zM79.7 49c4 0 4.3-3.3 4.3-4.6 0-1.3-.5-4.2-4-4.2h-2.8v8.8h2.5zM106.4 44.1v13.1c0 5-2.6 8.7-7.8 8.7-5.3 0-7.9-3.6-7.9-8.7V44.1c0-5 2.6-8.6 7.9-8.6 5.2 0 7.8 3.7 7.8 8.6zm-4.4 0c0-1.2 0-4.3-3.4-4.3s-3.4 3-3.4 4.3v13.1c0 1.3 0 4.3 3.4 4.3 3.3 0 3.4-3 3.4-4.3V44.1zM120.3 52.9H117v-4.4h7.9v8.7c0 5-2.6 8.7-7.9 8.7-6.3 0-7.8-4.7-7.8-8.7V44.1c0-5 2.6-8.6 7.8-8.6 6.6 0 7.9 4.6 7.9 8.6v.5h-4.5v-.5c0-1.3 0-4.3-3.4-4.3-3.3 0-3.4 3-3.4 4.3v13.1c0 1.3 0 4.3 3.4 4.3s3.4-3 3.4-4.3V53zM139.2 52.4l3.9 12.9h-4.8l-3.5-11.8h-3v11.8h-4.4V36h7.2c6 0 8.5 4.2 8.5 8.4 0 3.8-1.4 6.6-4 8zm-4.9-3.3c4 0 4.3-3.3 4.3-4.6 0-1.3-.5-4.2-4-4.2h-2.8v8.8h2.5zM145.7 65.3V36h15.7v4.4h-11v8h9.7v4.5h-9.7v7.9h11v4.5zM168.1 57.2c0 1.4.3 4.3 3.6 4.3 3.2 0 3.5-3 3.5-4 0-1.2-.5-3.5-3.7-4.9-5-2.2-7.7-3.5-7.7-9 0-5 2.5-8.1 7.9-8.1 6.3 0 7.8 4.6 7.8 8.6v1h-4.3v-1c0-1.3-.3-4.3-3.5-4.3-3.8 0-3.6 3.3-3.6 4.2 0 1.4.8 3 4 4.2 3.7 1.5 7.4 3.3 7.4 9.3 0 5-2.6 8.4-7.8 8.4-6.4 0-7.9-4.7-7.9-8.7v-2.6h4.3v2.6zM186.4 57.2c0 1.4.3 4.3 3.6 4.3 3.2 0 3.5-3 3.5-4 0-1.2-.5-3.5-3.6-4.9-5.1-2.2-7.8-3.5-7.8-9 0-5 2.6-8.1 7.9-8.1 6.3 0 7.9 4.6 7.9 8.6v1h-4.4v-1c0-1.3-.3-4.3-3.5-4.3-3.8 0-3.6 3.3-3.6 4.2 0 1.4.8 3 4 4.2 3.8 1.5 7.5 3.3 7.5 9.3 0 5-2.6 8.4-8 8.4-6.2 0-7.8-4.7-7.8-8.7v-2.6h4.3v2.6zM10.4 17.5V30H5.7V17.5L.1.6h4.7zM8.5.6L12 11.2 15.5.6z"/>
              </g>
            </svg>
            <nav class="View-menu">
              ${menu.map((props) => html`
                <a href="${props.href}" class="${className('View-link', { 'View-link--light': state.href === '', [`View-link--${props.type.toLowerCase()}`]: props.type })}" onclick=${props.onclick}>
                  ${props.label}
                </a>
              `)}
            </nav>
          </header>
          ${children}
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
        onclick: onclick(props.link),
        label: props.label || asText(props.link.data.title)
      })
    }

    function onclick (doc) {
      return function (event) {
        emit('pushState', event.currentTarget.href, doc)
        event.preventDefault()
      }
    }
  }
}
