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

var DEFAULT_SKILL = { label: text`Select one`, disabled: true, selected: true }

module.exports = view(page, meta)

function page (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getSingle('join', function (err, doc) {
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
              return html`
                <div class="u-bgDarkBlue u-colorWhite u-cf">
                  <form method="POST" action="/api/join" class="View-space u-container">
                    ${grid([
                      grid.cell({ size: { md: '1of3' } }, html`
                        <div class="Text">
                          <h2>${asText(slice.primary.heading)}</h2>
                          ${asElement(slice.primary.description, resolve)}
                        </div>
                      `),
                      grid.cell({ size: { md: '2of3' } }, html`
                        <div>
                          ${grid({ size: { md: '1of2' } }, [
                            html`
                              <div>
                                ${form.input({ label: text`Your name`, type: 'text', name: 'TODO:NAME', id: 'TODO:NAME', required: true })}
                                ${form.input({ label: text`LinkedIn profile`, type: 'url', name: 'TODO:LINKEDIN', id: 'TODO:LINKEDIN' })}
                                ${form.input({ label: text`Email`, type: 'email', name: 'TODO:EMAIL', id: 'TODO:EMAIL', required: true })}
                              </div>
                            `,
                            html`
                              <div>
                                ${form.select({ label: text`Select your skill`, name: 'TODO:SKILL', id: 'TODO:SKILL', required: true, options: [DEFAULT_SKILL].concat(asOptions(slice.primary.skills)) })}
                                ${form.textarea({ label: text`Further info`, name: 'TODO:INFO', id: 'TODO:INFO', placeholder: text`Please let us know why you’re interested in joining the network`, required: true })}
                              </div>
                            `
                          ])}
                          ${grid({ size: { md: '1of2' } }, [html`
                            <div class="u-flex u-spaceT2">
                              <div class="u-spaceR2">
                                ${button({ type: 'submit', text: text`Send`, fill: true })}
                              </div>
                              <div class="Text Text--small Text--adapt">
                                ${asElement(slice.primary.terms, resolve, function (type, node, content, children) {
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

function asOptions (text) {
  var reg = /^[^\w_]\s?/
  var options = []
  var parent = options
  var rows = text.split('\n')
  for (let i = 0, len = rows.length; i < len; i++) {
    if (!rows[i].trim()) continue
    if (reg.test(rows[i])) {
      parent = options
      let group = { label: rows[i].replace(reg, ''), options: [] }
      parent.push(group)
      parent = group.options
    } else {
      parent.push({ label: rows[i], value: rows[i] })
    }
  }

  return options
}

function meta (state) {
  return state.prismic.getSingle('join', function (err, doc) {
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
