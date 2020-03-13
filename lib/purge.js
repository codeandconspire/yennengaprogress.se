var cccpurge = require('cccpurge')
var Prismic = require('prismic-javascript')
var { resolve } = require('../components/base')

var REPOSITORY = 'https://yennengaprogress.cdn.prismic.io/api/v2'

module.exports = purge

function purge (urls, callback = Function.prototype) {
  if (typeof urls === 'function') {
    callback = urls
    urls = []
  }

  cccpurge(require('../index'), {
    urls: urls,
    resolve: resolveRoute,
    root: `https://${process.env.HOST}`,
    zone: process.env.CLOUDFLARE_ZONE,
    email: process.env.CLOUDFLARE_EMAIL,
    key: process.env.CLOUDFLARE_KEY
  }, callback)
}

async function resolveRoute (route, done) {
  switch (route) {
    case '/news/:uid': {
      return Prismic.api(REPOSITORY).then(function (api) {
        return api.query(
          Prismic.Predicates.at('document.type', 'news'),
          { pageSize: 100 }
        ).then(function (response) {
          var urls = response.results.map((doc) => `/news/${doc.uid}`)

          if (response.total_pages > 1) {
            let pages = []
            for (let i = 2; i <= response.total_pages; i++) {
              pages.push(api.query(
                Prismic.Predicates.at('document.type', 'news'),
                { pageSize: 100, page: i }
              ).then(function (response) {
                return response.results.map((doc) => `/news/${doc.uid}`)
              }))
            }
            return Promise.all(pages).then(function (urlsPerPage) {
              return urlsPerPage.reduce((flat, list) => flat.concat(list), urls)
            })
          }

          return urls
        }).then((urls) => done(null, urls)).catch(done)
      })
    }
    case '/projects/:uid': {
      return Prismic.api(REPOSITORY).then(function (api) {
        return api.query(
          Prismic.Predicates.at('document.type', 'projects'),
          { pageSize: 100 }
        ).then(function (response) {
          var urls = response.results.map((doc) => `/projects/${doc.uid}`)

          if (response.total_pages > 1) {
            let pages = []
            for (let i = 2; i <= response.total_pages; i++) {
              pages.push(api.query(
                Prismic.Predicates.at('document.type', 'projects'),
                { pageSize: 100, page: i }
              ).then(function (response) {
                return response.results.map((doc) => `/projects/${doc.uid}`)
              }))
            }
            return Promise.all(pages).then(function (urlsPerPage) {
              return urlsPerPage.reduce((flat, list) => flat.concat(list), urls)
            })
          }

          return urls
        }).then((urls) => done(null, urls)).catch(done)
      })
    }
    case '/:uid': {
      return Prismic.api(REPOSITORY).then(function (api) {
        return api.query(
          Prismic.Predicates.at('document.type', 'page'),
          { pageSize: 100 }
        ).then(function (response) {
          done(null, response.results.map((doc) => resolve(doc)))
        })
      }).catch(done)
    }
    default: return done(null)
  }
}
