var html = require('choo/html')
var asElement = require('prismic-element')
var { Elements } = require('prismic-richtext')
var view = require('../components/view')
var hero = require('../components/hero')
var grid = require('../components/grid')
var form = require('../components/form')
var button = require('../components/button')
var slices = require('../components/slices')
var serialize = require('../components/text/serialize')
var { i18n, memo, src, srcset, asText, resolve, HTTPError } = require('../components/base')

var text = i18n()

var DEFAULT_SKILL = { label: text`Select one`, disabled: true }

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
                  <form method="POST" action="/api/join" class="View-space u-container" onsubmit=${onsubmit}>
                    ${grid([
                      grid.cell({ size: { md: '1of2', lg: '1of3' } }, html`
                        <div class="Text">
                          <h2>${asText(slice.primary.heading)}</h2>
                          ${asElement(slice.primary.description, resolve)}
                        </div>
                      `),
                      grid.cell({ size: { md: '1of2', lg: '2of3' } }, html`
                        <div>
                          ${state.join.error ? html`
                            <div class="Text u-spaceB4">
                              <h3>${text`Oops`}</h3>
                              <p>${text`Something went wrong. Please, ensure that everything is filled in correctly before trying again.`}</p>
                              ${process.env.NODE_ENV === 'development' ? html`<pre>${state.join.error.stack}</pre>` : null}
                              <hr>
                            </div>
                          ` : null}
                          ${state.join.success && slice.primary.success_message.length ? html`
                            <div class="Text u-spaceB4">
                              ${asElement(slice.primary.success_message, resolve, serialize)}
                              <hr>
                            </div>
                          ` : null}
                          ${grid({ size: { lg: '1of2' } }, [
                            html`
                              <div>
                                ${form.input({ label: text`First name`, type: 'text', value: getValue('given_name'), name: 'given_name', id: 'given_name', required: true })}
                                ${form.input({ label: text`Last name`, type: 'text', value: getValue('family_name'), name: 'family_name', id: 'family_name', required: true })}
                                ${form.input({ label: text`LinkedIn profile`, type: 'url', value: getValue('linkedin'), name: 'linkedin', id: 'linkedin' })}
                                ${form.input({ label: text`Email`, type: 'email', value: getValue('email'), name: 'email', id: 'email', required: true })}
                              </div>
                            `,
                            html`
                              <div class="u-flex u-flexCol">
                                ${form.select({ label: text`Select your skill`, name: 'skill', id: 'skill', options: asOptions(slice.primary.skills) })}
                                ${form.textarea({ label: text`Further info`, class: 'u-sizeFill', value: getValue('info'), name: 'info', id: 'info', placeholder: text`Please let us know why you’re interested in joining the network`, required: true })}
                              </div>
                            `
                          ])}
                          ${grid({ size: { lg: '1of2' } }, [html`
                            <div class="u-flex u-spaceT2">
                              <div class="u-spaceR2">
                                ${button({ type: 'submit', text: text`Send`, fill: true, disabled: state.join.isLoading })}
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

  function getValue (key) {
    if (!state.join.data || !state.join.data.has(key)) return ''
    return state.join.data.get(key)
  }

  function onsubmit (event) {
    if (!this.checkValidity()) {
      this.reportValidity()
      event.preventDefault()
      return
    }
    var data = new window.FormData(this)
    emit('join', data)
    event.preventDefault()
  }

  function asOptions (text) {
    var reg = /^[^\w_]\s?/
    var options = []
    var parent = options
    var hasSelected = false
    var rows = text.split('\n')

    for (let i = 0, len = rows.length; i < len; i++) {
      if (!rows[i].trim()) continue
      if (reg.test(rows[i])) {
        parent = options
        let group = { label: rows[i].replace(reg, ''), options: [] }
        parent.push(group)
        parent = group.options
      } else {
        let isSelected = getValue('skill') === rows[i]
        if (isSelected) hasSelected = true
        parent.push({ label: rows[i], value: rows[i], selected: isSelected })
      }
    }

    options.unshift(Object.assign({}, DEFAULT_SKILL, { selected: !hasSelected }))

    return options
  }
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
