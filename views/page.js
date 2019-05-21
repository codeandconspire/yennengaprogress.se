var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var hero = require('../components/hero')
var slices = require('../components/slices')
var { memo, src, srcset, asText, resolve, HTTPError } = require('../components/base')

module.exports = view(page, meta)

function page (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getByUID('page', state.params.uid, function (err, doc) {
        if (err) throw HTTPError(404, err)
        if (!doc) {
          if (state.partial) {
            doc = state.partial
            let { title, description, label, image } = doc.data
            return html`
              <div class="View-space u-spaceT0">
                ${hero({
                  label: label,
                  title: title && asText(title),
                  description: description && asElement(description, resolve),
                  image: memo(function (url) {
                    if (!url) return null
                    return Object.assign({
                      alt: image.alt || '',
                      src: src(url, 800),
                      sizes: '(min-width: 900px) 50vw, 100vw',
                      srcset: srcset(url, [400, 800, [1400, 'q_70'], [1800, 'q_70'], [2600, 'q_60']])
                    }, image.dimensions)
                  }, [image && image.url, doc.id])
                })}
              </div>
            `
          }
          return html`<div class="View-space u-spaceT0">${hero.loading()}</div>`
        }

        emit('cover', Boolean(doc.data.image.url))

        return html`
          <div class="View-space u-spaceT0">
            ${hero({
              label: doc.data.label,
              title: asText(doc.data.title),
              description: asElement(doc.data.description, resolve),
              image: memo(function (url) {
                if (!url) return null
                return Object.assign({
                  alt: doc.data.image.alt || '',
                  src: src(url, 800),
                  sizes: '(min-width: 900px) 50vw, 100vw',
                  srcset: srcset(url, [400, 800, [1400, 'q_70'], [1800, 'q_70'], [2600, 'q_60']])
                }, doc.data.image.dimensions)
              }, [doc.data.image.url])
            })}
          </div>
          <div class="View-space">
            ${slices(doc.data.body, state, emit)}
          </div>
        `
      })}
    </main>
  `
}

function meta (state) {
  return state.prismic.getByUID('page', state.params.uid, function (err, doc) {
    if (err) throw HTTPError(404, err)
    if (!doc) return null

    var title = asText(doc.data.title)
    var props = {
      title: title,
      'og:title': title,
      description: asText(doc.data.description)
    }

    var image = doc.data.featured_image
    if (!image.url) image = doc.data.image
    if (image.url) {
      props['og:image'] = src(image.url, 1200)
      props['og:image:width'] = 1200
      props['og:image:height'] = (image.dimensions.height / image.dimensions.width) * 1200
    }

    return props
  })
}
