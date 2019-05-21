var html = require('choo/html')
var asElement = require('prismic-element')
var view = require('../components/view')
var grid = require('../components/grid')
var card = require('../components/card')
var hero = require('../components/hero')
var button = require('../components/button')
var slices = require('../components/slices')
var { i18n, memo, metaKey, src, srcset, asText, resolve, HTTPError } = require('../components/base')

var FACTS_LABELS = ['Location', 'Supervisor', 'Status']

var text = i18n()

module.exports = view(project, meta)

function project (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getByUID('project', state.params.uid, function (err, doc) {
        if (err) throw HTTPError(404, err)
        if (!doc) {
          if (state.partial) {
            doc = state.partial
            let { title, description, label, image } = doc.data
            return hero({
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
            })
          }
          return hero.loading()
        }

        emit('cover', Boolean(doc.data.image.url))

        return html`
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
          <div class="u-bgSand u-cf">
            <div class="u-container u-spaceV6">
              ${grid({ size: { md: '1of3' } }, FACTS_LABELS.map((label) => html`
                <div class="Text u-textCenter">
                  <h2 class="Text-h3 u-colorDarkBlue u-spaceB0">${text(label)}</h2>
                  <p class="u-spaceT1">${doc.data[label.toLowerCase()]}</p>
                </div>
              `))}
            </div>
          </div>
          <div class="u-container">
            ${grid({ size: { md: '1of2' }, compact: true }, [
              card({
                large: true,
                theme: 'white',
                label: text`Contributing to these`,
                title: text`Global Goals`,
                body: html`
                  ${grid({ size: { lg: '1of4', xs: '1of2' } }, doc.data.goals.map(({ goal }, index) => html`
                    <a href="/projects?goal=${encodeURIComponent(goal)}" class="u-spaceR2 u-spaceB2">
                      <img src="/goal-${goal.match(/^(\d+)/)[1]}.svg" alt="${goal}">
                    </a>
                  `))}
                  <div class="Text">
                    <small class="Text-muted u-colorDefault">${text`Click on a target to view related projects.`}</small>
                  </div>
                `
              }),
              card({
                large: true,
                theme: 'umber',
                label: doc.data.support_label,
                title: asText(doc.data.support_heading),
                body: html`
                  <div class="Text Text--small">
                    ${asElement(doc.data.support_text, resolve)}
                    <hr class="u-spaceT6">
                    <p>${doc.data.support_cta}</p>
                    ${doc.data.support_link.id && !doc.data.support_link.isBroken ? button({
                      fill: true,
                      text: doc.data.support_link.data.cta || text`Read more`,
                      href: resolve(doc.data.support_link),
                      onclick (event) {
                        if (metaKey(event)) return
                        emit('pushState', event.currentTarget.href, doc.data.support_link)
                        event.preventDefault()
                      }
                    }) : null}
                  </div>
                `
              })
            ])}
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
  return state.prismic.getByUID('project', state.params.uid, function (err, doc) {
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
