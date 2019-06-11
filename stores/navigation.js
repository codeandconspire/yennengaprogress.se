/* global gtag */

module.exports = navigation

function navigation (state, emitter) {
  state.partial = null

  emitter.prependListener('pushState', onnavigate)
  emitter.prependListener('replaceState', onnavigate)

  emitter.prependListener('pushState', function (href, opts = {}) {
    if (opts.partial) state.partial = opts.partial
    else state.partial = null
  })

  emitter.on('navigate', function () {
    if (typeof gtag !== 'function') return
    emitter.on('navigate', function () {
      gtag('config', 'UA-140411804-1', {
        'page_title': state.title,
        'page_path': state.href
      })
    })
  })

  function onnavigate (href, opts = {}) {
    if (!opts.preventScroll) {
      window.requestAnimationFrame(function () {
        window.scrollTo(0, 0)
      })
    }
  }
}
