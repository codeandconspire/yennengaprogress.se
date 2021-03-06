var html = require('choo/html')
var parse = require('date-fns/parse')
var asElement = require('prismic-element')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var card = require('../components/card')
var news = require('../components/news')
var Anchor = require('../components/anchor')
var button = require('../components/button')
var Zigzag = require('../components/zigzag')
var method = require('../components/method')
var banner = require('../components/banner')
var recruit = require('../components/recruit')
var Landing = require('../components/landing')
var { i18n, memo, src, metaKey, srcset, slugify, resolve, asText, loader, HTTPError } = require('../components/base')

var text = i18n()

module.exports = view(home, meta)

function home (state, emit) {
  return html`
    <main class="View-main">
      ${state.prismic.getSingle('homepage', function (err, doc) {
        if (err) throw HTTPError(500, err)
        if (!doc) {
          if (state.partial) {
            doc = state.partial
            return state.cache(Landing, 'homepage-landing').render({
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
              title: asText(doc.data.title)
            })
          }
          return html`<div class="View-space u-spaceT0">${Landing.loading()}</div>`
        }

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
          <section class="View-space u-container">
            ${state.cache(Anchor, slugify(doc.data.method_label)).render()}
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
          <div class="View-space">
            ${state.cache(Anchor, slugify(doc.data.banner_label)).render()}
            ${doc.data.banner_image.url ? banner({
              label: doc.data.banner_label,
              title: asText(doc.data.banner_heading),
              button: memo(function (link) {
                if ((!link.id && !link.url) || link.isBroken) return null
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
          <div class="View-space u-container">
            ${state.cache(Anchor, slugify(asText(doc.data.recruit_heading))).render()}
            ${recruit({
              title: asText(doc.data.recruit_heading),
              body: asElement(doc.data.recruit_text),
              actions: doc.data.recruit_actions.map(function ({ link, type }) {
                if ((!link.id && !link.url) || link.isBroken) return null
                return {
                  primary: type.toLowerCase() === 'primary',
                  href: link.url || resolve(link),
                  external: link.target === '_blank',
                  text: link.data && link.data.cta ? link.data.cta : text`Read more`
                }
              }).filter(Boolean)
            })}
          </div>
          <section class="View-space">
            ${state.cache(Anchor, 'projects').render()}
            ${state.cache(Zigzag, 'homepage-projects').render(doc.data.featured_projects.map(function ({ link }, index) {
              if (!link.id || link.isBroken) return null
              var image = link.data.featured_image
              if (!image || !image.url) image = link.data.image

              return card({
                large: true,
                label: link.data.label,
                title: asText(link.data.title),
                body: asElement(link.data.description),
                theme: index % 3 ? card.themes[index % card.themes.length] : null,
                image: index % 3 ? null : memo(function (url) {
                  if (!url) return null
                  return Object.assign({
                    alt: link.data.image.alt || '',
                    sizes: '(min-width: 600px) 50vw, 100vw',
                    src: src(url, 600),
                    srcset: srcset(url, [400, 800, [1600, 'q_80'], [2600, 'q_70']])
                  }, link.data.image.dimensions)
                }, [image && image.url, link.id, 'card']),
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
          <section class="View-space u-container">
            ${state.cache(Anchor, 'news').render()}
            ${state.prismic.getSingle('news_listing', function (err, listing) {
              if (err) return null
              var query = Predicates.at('document.type', 'news')
              var opts = {
                pageSize: 3,
                orderings: '[document.first_publication_date desc]'
              }

              return html`
                <div class="Text">
                  <h1>${listing ? asText(listing.data.title) : loader(5)}</h1>
                </div>
                ${state.prismic.get(query, opts, function (err, response) {
                  if (err) return null

                  var items = []
                  if (!response) {
                    for (let i = 0; i < 3; i++) items.push(null)
                  } else {
                    items = response.results.map((result) => ({
                      title: asText(result.data.title),
                      body: asElement(result.data.description, resolve),
                      date: parse(result.first_publication_date),
                      href: resolve(result),
                      onclick (event) {
                        if (metaKey(event)) return
                        emit('pushState', event.target.href, { partial: result })
                        event.preventDefault()
                      }
                    }))
                  }

                  return news(`${doc.id}-news`, items)
                })}
                ${listing ? button({
                  href: resolve(listing),
                  text: doc.data.cta || text`All news`,
                  onclick (event) {
                    if (metaKey(event)) return
                    emit('pushState', event.currentTarget.href, { partial: doc })
                    event.preventDefault()
                  }
                }) : null}
              `
            })}
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
