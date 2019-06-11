var html = require('choo/html')
var asElement = require('prismic-element')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var card = require('../components/card')
var Zigzag = require('../components/zigzag')
var { i18n, src, srcset, memo, metaKey, resolve, asText, loader, HTTPError } = require('../components/base')

var PAGE_SIZE = 10

var text = i18n()

module.exports = view(home, meta)

function home (state, emit) {
  return html`
    <main class="View-main View-main--background">
      <div class="View-space View-space--hero u-container">
        ${state.prismic.getSingle('project_listing', function (err, doc) {
          if (err) throw HTTPError(500, err)
          doc = doc || state.partial

          var featured = doc && doc.data.featured_projects && !state.query.goal
            ? doc.data.featured_projects.filter(function (item) {
              return item.link.id && !item.link.isBroken
            }).map((item) => item.link)
            : []

          var pages = []
          var page = parseInt(state.query.page, 10)
          if (isNaN(page)) page = 1
          for (let i = 1; i <= page; i++) pages.push(getPage(i))

          var response = pages.find(Boolean)
          var totalPages = response && response.total_pages
          var hasMore = totalPages ? totalPages > pages.length : false

          var projects = featured.concat(pages.reduce(function (acc, response) {
            if (response) return acc.concat(response.results)
            for (let i = 0; i < 4; i++) acc.push(null)
            return acc
          }, []))

          if (hasMore) {
            projects = projects.slice(0, projects.length - featured.length)
          }

          return html`
            <div class="View-space u-spaceT0">
              <div class="Text Text--narrow">
                <h1>${doc ? asText(doc.data.title) : loader(5)}</h1>
                ${doc ? asElement(doc.data.description) : html`<p>${loader(48)}</p>`}
              </div>
            </div>
            ${state.cache(Zigzag, 'projects-listing', { static: true }).render(projects.map(function (doc, index) {
              var appear = page !== 1 &&
                index >= (PAGE_SIZE * page) - PAGE_SIZE &&
                !state.ui.isLandingPage

              if (!doc) return card.loading({ large: true, appear })

              var image = doc.data.featured_image
              if (!image || !image.url) image = doc.data.image

              return card({
                large: true,
                appear: appear,
                label: doc.data.label,
                title: asText(doc.data.title),
                body: asElement(doc.data.description),
                theme: index % 3 ? card.themes[index % card.themes.length] : null,
                image: index % 3 ? null : memo(function (url) {
                  if (!url) return null
                  return Object.assign({
                    alt: doc.data.image.alt || '',
                    sizes: '(min-width: 600px) 50vw, 100vw',
                    src: src(url, 600),
                    srcset: srcset(url, [400, 800, [1600, 'q_80'], [2600, 'q_70']])
                  }, doc.data.image.dimensions)
                }, [image && image.url, doc.id, 'card']),
                link: {
                  href: resolve(doc),
                  text: doc.data.cta || text`Read more`,
                  onclick (event) {
                    if (metaKey(event)) return
                    emit('pushState', event.currentTarget.href, { partial: doc })
                    event.preventDefault()
                  }
                }
              })
            }), hasMore ? {
              href: resolve(doc) + `?page=${page + 1}`,
              text: text`Show more projects`,
              onclick (event) {
                if (metaKey(event)) return
                emit('pushState', event.currentTarget.href, { preventScroll: true })
                event.preventDefault()
              }
            } : null)}
          `

          function getPage (page = 1) {
            var query = [Predicates.at('document.type', 'project')]
            var opts = {
              page: page,
              pageSize: PAGE_SIZE,
              orderings: '[document.first_publication_date desc]'
            }

            if (state.query.goal) {
              let value = decodeURIComponent(state.query.goal)
              query.push(Predicates.at('my.project.goals.goal', value))
            }

            for (let i = 0, len = featured.length; i < len; i++) {
              query.push(Predicates.not('document.id', featured[i].id))
            }

            return state.prismic.get(query, opts, function (err, response) {
              if (err) throw HTTPError(400, err)
              return response
            })
          }
        })}
      </div>
    </main>
  `
}

function meta (state) {
  return state.prismic.getSingle('project_listing', function (err, doc) {
    if (err) throw HTTPError(500, err)
    if (!doc) return null

    var props = {
      title: asText(doc.data.title),
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
