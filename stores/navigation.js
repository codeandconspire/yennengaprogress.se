module.exports = navigation

function navigation (state, emitter) {
  state.partial = null

  emitter.prependListener('pushState', onnavigate)
  emitter.prependListener('replaceState', onnavigate)

  emitter.prependListener('pushState', function (href, next) {
    if (next) state.partial = next
    else state.partial = null
  })

  function onnavigate (href) {
    window.requestAnimationFrame(function () {
      window.scrollTo(0, 0)
    })
  }
}
