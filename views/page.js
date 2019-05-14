var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var hero = require('../components/hero')
var vcard = require('../components/vcard')
var serialize = require('../components/text/serialize')
var { memo, src, srcset, asText, resolve, HTTPError } = require('../components/base')

module.exports = view(page, meta)

function page (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getByUID('page', state.params.uid, function (err, doc) {
        if (err) throw HTTPError(404, err)
        if (!doc) return html`<div class="View-space u-spaceT0">${hero.loading()}</div>`

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
                  srcset: srcset(url, [400, 800, [1400, 'q_70'], [1800, 'q_70'], [2600, 'q_60']], { transforms: 'c_thumb' })
                }, doc.data.image.dimensions)
              }, [doc.data.image.url])
            })}
          </div>
          <div class="View-space">
            ${doc.data.body.map(function (slice, index) {
              switch (slice.slice_type) {
                case 'text': return html`
                  <div class="View-space u-container">
                    <div class="Text">
                      ${asElement(slice.primary.text, resolve, serialize)}
                    </div>
                  </div>
                `
                case 'image': {
                  var image = slice.primary.image
                  if (!image.url) return null

                  let source = image.url
                  let attrs = Object.assign({ alt: image.alt || '' }, image.dimensions)
                  if (!/\.(svg|gifv?)$/.test(image.url)) {
                    attrs.sizes = '100vw'
                    attrs.srcset = srcset(image.url, [400, 600, 800, 1200, [1800, 'q_70'], [2600, 'q_50']])
                    source = src(image.url, 800)
                  }

                  let caption = []
                  if (image.alt) caption.push(image.alt)
                  if (image.copyright) caption.push(image.copyright)

                  return html`
                    <div class="View-space u-container">
                      <div class="Text u-sizeFull">
                        <figure>
                          <img ${attrs} src="${source}">
                          ${caption.length ? html`
                            <figcaption class="Text-caption">${caption.join(' ')}</figcaption>
                          ` : null}
                        </figure>
                      </div>
                    </div>
                  `
                }
                case 'contact_cards': {
                  let items = slice.items.filter(function (item) {
                    return item.name.length || item.description.length
                  })
                  if (!items.length) return null
                  var heading = asText(slice.primary.heading)
                  return html`
                    <div class="View-space u-container u-small">
                      ${heading ? html`
                        <div class="Text u-spaceB4">
                          <h2>${heading}</h2>
                        </div>
                      ` : null}
                      ${items.map((item) => vcard({
                        label: item.label,
                        title: asText(item.name),
                        body: html`
                          <div class="Text u-sizeFull">
                            ${asElement(item.description, resolve)}
                          </div>
                        `,
                        image: memo(function (url) {
                          if (!url) return null
                          return Object.assign({
                            sizes: '7.5em',
                            alt: item.image.alt || '',
                            src: src(url, 200, { transforms: 'g_face', aspect: 1 }),
                            srcset: srcset(url, [200, 400, 600], { transforms: 'g_face', aspect: 1 })
                          }, item.image.dimensions)
                        }, [item.image.url, 'vcard'])
                      }))}
                    </div>
                  `
                }
                default: return null
              }
            })}
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
