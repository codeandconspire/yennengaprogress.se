var html = require('choo/html')
var parse = require('date-fns/parse')
var asElement = require('prismic-element')
var { Predicates } = require('prismic-javascript')
var view = require('../components/view')
var news = require('../components/news')
var button = require('../components/button')
var { i18n, src, metaKey, resolve, asText, loader, HTTPError } = require('../components/base')

var PAGE_SIZE = 9

var text = i18n()

module.exports = view(home, meta)

function home (state, emit) {
  return html`
    <main class="View-main View-main--background">
      <div class="View-space View-space--hero u-container">
        ${state.prismic.getSingle('news_listing', function (err, doc) {
          if (err) throw HTTPError(500, err)
          doc = doc || state.partial

          var pages = []
          var page = parseInt(state.query.page, 10)
          if (isNaN(page)) page = 1
          for (let i = 1; i <= page; i++) pages.push(getPage(i))

          var response = pages.find(Boolean)
          var total = response && response.total_pages
          var hasMore = total ? total > pages.length : false

          return html`
            <div class="Text Text--narrow">
              <h1>${doc ? asText(doc.data.title) : loader(5)}</h1>
              ${doc ? asElement(doc.data.description) : html`<p>${loader(48)}</p>`}
            </div>
            ${news('news-listing', pages.reduce(function (acc, response, index) {
              if (!response) {
                for (let i = 0; i < 9; i++) acc.push(null)
                return acc
              }
              return acc.concat(response.results.map((doc) => ({
                appear: page !== 1 && page === index + 1 && !state.ui.isLandingPage,
                title: asText(doc.data.title),
                body: asElement(doc.data.description, resolve),
                date: parse(doc.first_publication_date),
                href: resolve(doc),
                onclick (event) {
                  if (metaKey(event)) return
                  emit('pushState', event.target.href, doc)
                  event.preventDefault()
                }
              })))
            }, []))}
            ${hasMore ? button({
              text: text`Show more news`,
              href: resolve(doc) + `?page=${page + 1}`,
              onclick (event) {
                if (metaKey(event)) return
                emit('pushState', event.currentTarget.href, { preserveScroll: true })
                event.preventDefault()
              }
            }) : null}
          `
        })}
      </div>
    </main>
  `

  function getPage (page = 1) {
    var query = Predicates.at('document.type', 'news')
    var opts = {
      page: page,
      pageSize: PAGE_SIZE,
      orderings: '[document.first_publication_date desc]'
    }

    return state.prismic.get(query, opts, function (err, response) {
      if (err) throw HTTPError(400, err)
      return response
    })
  }
}

function meta (state) {
  return state.prismic.getSingle('news_listing', function (err, doc) {
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
