var html = require('choo/html')
var asElement = require('prismic-element')
var { Elements } = require('prismic-richtext')
var view = require('../components/view')
var hero = require('../components/hero')
var grid = require('../components/grid')
var form = require('../components/form')
var button = require('../components/button')
var slices = require('../components/slices')
var { i18n, memo, src, srcset, asText, resolve, HTTPError } = require('../components/base')

var text = i18n()

module.exports = view(page, meta)

function page (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getSingle('donate', function (err, doc) {
        if (err) throw HTTPError(404, err)
        if (!doc) {
          if (state.partial) {
            doc = state.partial
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
                  }, [doc.data.image.url, doc.id])
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
            ${slices(doc.data.body, state, emit, function (slice) {
              if (!slice.slice_type === 'form') return null
              var { callback, heading, description, terms, purchase } = slice.primary
              return html`
                <div class="u-bgDarkBlue u-colorWhite u-cf">
                  <form method="POST" action="https://old.yennengaprogress.se/projekt/yennenga-progress/?page=donate" class="View-space u-container">
                    <input type="hidden" name="callback_url" value="${state.origin + (callback.id && !callback.isBroken ? resolve(slice.primary.callback) : state.href)}">
                    <input type="hidden" name="shop_url" value="${state.origin + state.href}">
                    <input type="hidden" name="language" value="${doc.lang.split('-')[0]}">
                    <input type="hidden" name="projectid" value="7188">
                    ${purchase ? html`<input type="hidden" name="title" value="${purchase}">` : null}
                    ${grid([
                      grid.cell({ size: { md: '1of2', lg: '1of3' } }, html`
                        <div class="Text">
                          <h2>${asText(heading)}</h2>
                          ${asElement(description, resolve)}
                        </div>
                      `),
                      grid.cell({ size: { md: '1of2', lg: '2of3' } }, html`
                        <div>
                          ${grid({ size: { lg: '1of2' } }, [
                            html`
                              <div>
                                ${form.input({ label: text`First name`, type: 'text', name: 'firstname', id: 'firstname', required: true })}
                                ${form.input({ label: text`Last name`, type: 'text', name: 'lastname', id: 'lastname', required: true })}
                              </div>
                              `,
                            html`
                              <div>
                                ${form.input({ label: text`How much would you like to donate?`, value: 100, min: 0, type: 'number', name: 'donation', id: 'donation', required: true })}
                                ${form.input({ label: text`Email`, type: 'email', name: 'email', id: 'email', required: true })}
                              </div>
                            `
                          ])}
                          ${grid({ size: { lg: '1of2' } }, [html`
                            <div class="u-flex u-spaceT2">
                              <div class="u-spaceR2">
                                ${button({ type: 'submit', text: text`Donate`, fill: true })}
                              </div>
                              <div class="Text Text--small Text--adapt">
                                ${asElement(terms, resolve, function (type, node, content, children) {
                                  if (type === Elements.paragraph) return html`<p><small class="Text-muted">${children}</small></p>`
                                  return null
                                })}
                              </div>
                            </div>
                          `])}
                        </div>
                      `)
                    ])}
                  </form>
              </div>
              `
            })}
          </div>
        `
      })}
    </main>
  `
}

function meta (state) {
  return state.prismic.getSingle('donate', function (err, doc) {
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
