var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var method = require('../components/method')
var banner = require('../components/banner')
var Landing = require('../components/landing')
var { i18n, memo, srcset, slugify, resolve, asText, HTTPError } = require('../components/base')

var text = i18n()

module.exports = view(home, meta)

function home (state, emit) {
  return html`
    <main class="View-main">
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
          }, doc.data.image.dimensions)
        }, [doc.data.image.url])

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
          <section class="View-space u-spaceT0 u-container" id="${slugify(doc.data.method_label)}">
            ${method({
              label: doc.data.method_label,
              title: asText(doc.data.method_heading),
              items: doc.data.methods.map(function (slice) {
                return {
                  image: slice.slice_type,
                  heading: asText(slice.primary.heading),
                  body: asElement(slice.primary.description, resolve)
                }
              })
            })}
          </section>
          <div class="View-space" id="${slugify(doc.data.banner_label)}">
            ${doc.data.banner_image.url ? banner({
              label: doc.data.banner_label,
              title: asText(doc.data.banner_heading),
              button: memo(function (link) {
                if ((!link.id && !link.url) && link.isBroken) return null
                return {
                  href: link.url || resolve(link),
                  external: link.target === '_blank',
                  text: link.data || link.data.cta ? link.data.cta : text`Read more`
                }
              }, [doc.data.banner_link]),
              image: memo(function (url) {
                if (!url) return null
                return Object.assign({
                  alt: doc.data.banner_image.alt || '',
                  src: srcset(url, [900]).split(' ')[0],
                  sizes: '100vw',
                  srcset: srcset(url, [400, 600, 900, [1600, 'q_70'], [2500, 'q_50']], { transforms: 'c_thumb' })
                }, doc.data.banner_image.dimensions)
              }, [doc.data.banner_image.url])
            }) : null}
          </div>
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
      title: state.prismic.getSingle('website', function (err, doc) {
        if (err) throw HTTPError(500, err)
        if (!doc) return text`Loading`
        return asText(doc.data.title)
      }),
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
