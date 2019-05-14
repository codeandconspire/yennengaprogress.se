var html = require('choo/html')
var parse = require('date-fns/parse')
var asElement = require('prismic-element')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var card = require('../components/card')
var news = require('../components/news')
var Zigzag = require('../components/zigzag')
var method = require('../components/method')
var banner = require('../components/banner')
var recruit = require('../components/recruit')
var Landing = require('../components/landing')
var { i18n, memo, src, srcset, slugify, resolve, asText, loader, HTTPError } = require('../components/base')

var text = i18n()

module.exports = view(home, meta)

function home (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getSingle('homepage', function (err, doc) {
        if (err) throw HTTPError(500, err)
        if (!doc) return html`<div class="View-space u-spaceT0">${Landing.loading()}</div>`

        return html`
          ${state.cache(Landing, 'homepage-landing').render({
            image: memo(function (url) {
              if (!url) return null
              return Object.assign({
                alt: doc.data.image.alt || '',
                src: src(url, 400),
                sizes: '50vw (min-width: 900px), 100vw',
                srcset: srcset(url, [400, 600, 800, [1600, 'q_70']])
              }, doc.data.image.dimensions)
            }, [doc.data.image.url]),
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
                  text: link.data && link.data.cta ? link.data.cta : text`Read more`
                }
              }, [doc.data.banner_link]),
              image: memo(function (url) {
                if (!url) return null
                return Object.assign({
                  alt: doc.data.banner_image.alt || '',
                  src: src(url, 900, { transforms: 'g_faces' }),
                  sizes: '100vw',
                  srcset: srcset(url, [400, 600, 900, [1600, 'q_70'], [2500, 'q_50']], { transforms: 'g_faces' })
                }, doc.data.banner_image.dimensions)
              }, [doc.data.banner_image.url])
            }) : null}
          </div>
          <div class="View-space u-container" id="${slugify(asText(doc.data.recruit_heading))}">
            ${recruit({
              title: asText(doc.data.recruit_heading),
              body: asElement(doc.data.recruit_text),
              actions: doc.data.recruit_actions.map(function ({ link, type }) {
                if ((!link.id && !link.url) && link.isBroken) return null
                return {
                  primary: type.toLowerCase() === 'primary',
                  href: link.url || resolve(link),
                  external: link.target === '_blank',
                  text: link.data && link.data.cta ? link.data.cta : text`Read more`
                }
              })
            })}
          </div>
          <section class="View-space" id="projects">
            ${state.cache(Zigzag, 'homepage-projects').render(doc.data.featured_projects.map(function ({ link }, index) {
              if (!link.id || link.isBroken) return null
              return card({
                label: link.data.label,
                title: asText(link.data.title),
                body: asElement(link.data.description),
                theme: index % 3 ? card.themes[index % card.themes.length] : null,
                image: index % 3 ? null : memo(function (url) {
                  if (!url) return null
                  return Object.assign({
                    alt: link.data.image.alt || '',
                    sizes: '50vw (min-width: 600px), 100vw',
                    src: src(url, 600, { transforms: 'c_thumb' }),
                    srcset: srcset(url, [400, 800, [1600, 'q_80'], [2600, 'q_70']], { transforms: 'c_thumb' })
                  }, link.data.image.dimensions)
                }, [(link.data.featured_image || link.data.image).url, 'card']),
                link: {
                  href: resolve(link),
                  text: link.data.cta || text`Read more`,
                  external: link.target === '_blank'
                }
              })
            }).filter(Boolean), state.prismic.getSingle('project_listing', function (err, doc) {
              if (err || !doc) return null
              return {
                href: resolve(doc),
                text: doc.data.cta || text`Show all projects`
              }
            }))}
          </section>
          <section class="View-space u-container" id="news">
            ${news(state.prismic.getSingle('news_listing', function (err, doc) {
              if (err) return null
              var query = Predicates.at('document.type', 'news')
              var opts = {
                pageSize: 3,
                orderings: '[document.first_publication_date desc]'
              }
              return state.prismic.get(query, opts, function (err, response) {
                if (err) return null
                return {
                  title: doc ? asText(doc.data.title) : loader(5),
                  link: doc ? {
                    href: resolve(doc),
                    text: doc.data.cta || text`All news`
                  } : null,
                  items: response ? response.results.map((doc) => ({
                    title: asText(doc.data.title),
                    body: asElement(doc.data.description, resolve),
                    date: parse(doc.first_publication_date),
                    href: resolve(doc)
                  })) : null
                }
              })
            }))}
          </section>
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
      props['og:image'] = src(image.url, 1200)
      props['og:image:width'] = 1200
      props['og:image:height'] = (image.dimensions.height / image.dimensions.width) * 1200
    }

    return props
  })
}
