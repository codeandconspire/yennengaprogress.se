var html = require('choo/html')
var asElement = require('prismic-element')
var card = require('../card')
var grid = require('../grid')
var block = require('../block')
var vcard = require('../vcard')
var serialize = require('../text/serialize')
var { i18n, memo, src, srcset, asText, resolve, metaKey } = require('../base')

var text = i18n()

module.exports = slices

function slices (slices, state, emit, render = () => null) {
  return slices.map(function (slice, index) {
    switch (slice.slice_type) {
      case 'text': return html`
        <div class="View-space u-container u-medium">
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
        let heading = asText(slice.primary.heading)

        return html`
          <div class="View-space u-container u-medium">
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
      case 'blocks': {
        let items = slice.items.filter(function (item) {
          return item.image.url || item.title.length || item.body.length
        })

        if (!items.length) return null
        let heading = asText(slice.primary.heading)

        return html`
          <div class="View-space u-container">
            ${heading ? html`
              <div class="Text u-sizeFull u-spaceB4">
                <h2>${heading}</h2>
              </div>
            ` : null}
            ${grid({ size: { sm: '1of2', md: '1of3' } }, items.map(function (item) {
              return block({
                title: asText(item.title),
                body: item.body ? asElement(item.body) : null,
                image: memo(function (url) {
                  if (!url) return null
                  var attrs = Object.assign({
                    alt: item.image.alt || '',
                    src: url
                  }, item.image.dimensions)

                  if (!/\.(svg|gifv?)$/.test(url)) {
                    attrs.sizes = '11rem'
                    attrs.src = src(url, 600, { transforms: 'g_face' })
                    attrs.srcset = srcset(url, [200, 400], { transforms: 'g_face' })
                  }

                  return attrs
                }, [item.image.url, state.href])
              })
            }))}
          </div>
        `
      }
      case 'links': {
        let items = slice.items.filter(function (item) {
          return item.link.id && !item.link.isBroken
        })

        if (!items.length) return null
        let heading = asText(slice.primary.heading)

        return html`
          <div class="View-space u-container">
            ${heading ? html`
              <div class="Text u-sizeFull u-spaceB4">
                <h2>${heading}</h2>
              </div>
            ` : null}
            ${grid({ size: { sm: '1of2', md: '1of3' } }, items.map(function ({ link }) {
              var image = link.data.featured_image
              if (!image || !image.url) image = link.data.image
              return card({
                label: link.data.label,
                title: asText(link.data.title),
                body: link.data.description ? asElement(link.data.description) : null,
                theme: !image || !image.url ? card.themes[0] : null,
                image: memo(function (url) {
                  if (!url) return null
                  return Object.assign({
                    alt: link.data.image.alt || '',
                    src: src(url, 600),
                    sizes: '(min-width: 600px) 33.33vw, (min-width: 400px) 50vw, 100vw',
                    srcset: srcset(url, [400, 800, [1600, 'q_80'], [2600, 'q_70']])
                  }, image.dimensions)
                }, [image && image.url, state.href]),
                link: {
                  href: resolve(link),
                  text: link.data.cta || text`Read more`,
                  external: link.target === '_blank',
                  onclick (event) {
                    if (link.target === '_blank' || metaKey(event)) return
                    emit('pushState', resolve(link), { partial: link })
                    event.preventDefault()
                  }
                }
              })
            }))}
          </div>
        `
      }
      case 'faq': {
        var items = slice.items.filter(function (item) {
          return item.question.length && item.answer.length
        })
        if (!items.length) return null
        let heading = asText(slice.primary.heading)
        return html`
          <div class="View-space u-container u-medium">
            <div class="Text u-sizeFull">
              ${heading ? html`<h2 class="u-spaceB1">${heading}</h2>` : null}
              <dl>
                ${items.reduce(function (acc, item) {
                  acc.push(
                    html`<dt>${asText(item.question)}</dt>`,
                    html`<dd>${asElement(item.answer, resolve, serialize)}</dd>`
                  )
                  return acc
                }, [])}
              </dl>
            </div>
          </div>
        `
      }
      default: return render(slice, index, slices)
    }
  })
}
