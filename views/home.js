var html = require('choo/html')
var view = require('../components/view')
var Landing = require('../components/landing')
var { i18n, memo, srcset, resolve, asText, HTTPError } = require('../components/base')

var text = i18n()

module.exports = view(home, meta)

function home (state, emit) {
  return html`
    <main class="View-main" style="margin-bottom: 200vh;">
      ${state.prismic.getSingle('homepage', function (err, doc) {
        if (err) throw HTTPError(500, err)
        if (!doc) return Landing.loading()

        var image = memo(function (url) {
          if (!url) return null
          return Object.assign({
            alt: doc.data.image.alt || '',
            src: srcset(url, [400]).split(' ')[0],
            sizes: '50vw (min-width: 900px), 100vw',
            srcset: srcset(url, [400, 600, 800, [1600, 'q_70']])
          }, doc.data.image.domensions)
        }, [doc && doc.data.image.url])

        return html`
          ${state.cache(Landing, 'homepage-landing').render({
            image,
            caption: doc.data.image.alt,
            title: asText(doc.data.title),
            link: doc.data.cta_link.id ? {
              href: resolve(doc.data.cta_link),
              text: doc.data.cta_text || doc.data.cta_link.data.cta || text`Read more`
            } : null
          })}
        `
      })}
    </main>
  `
}

function meta (state) {
  return state.prismic.getSingle('homepage', function (err, doc) {
    if (err) throw HTTPError(500, err)
    if (!doc) return null

    var props = {
      title: asText(doc.data.title),
      description: asText(doc.data.description)
    }

    var image = doc.data.featured_image
    if (image.url) {
      props['og:image'] = image.url
      props['og:image:width'] = image.dimensions.width
      props['og:image:height'] = image.dimensions.height
    }

    return props
  })
}
