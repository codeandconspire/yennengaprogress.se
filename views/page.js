var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var hero = require('../components/hero')
var { memo, srcset, asText, resolve, HTTPError } = require('../components/base')

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
                  src: srcset(url, [800]).split(' ')[0],
                  sizes: '(min-width: 900px) 50vw, 100vw',
                  srcset: srcset(url, [400, 800, [1400, 'q_70'], [1800, 'q_70'], [2600, 'q_60']], { transforms: 'c_thumb' })
                }, doc.data.image.dimensions)
              }, [doc.data.image.url])
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
      props['og:image'] = image.url
      props['og:image:width'] = image.dimensions.width
      props['og:image:height'] = image.dimensions.height
    }

    return props
  })
}
