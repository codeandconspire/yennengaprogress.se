module.exports = ui

function ui (state, emitter) {
  state.ui = state.ui || {}
  state.ui.isLoading = false
  state.ui.isCovered = false
  state.ui.isLandingPage = true

  emitter.on('cover', function (value) {
    state.ui.isCovered = value
  })

  emitter.on('navigate', function () {
    state.ui.isCovered = false
    state.ui.isLandingPage = false
  })

  var requests = 0
  emitter.on('prismic:request', start)
  emitter.on('prismic:response', end)
  emitter.on('prismic:error', end)

  function start () {
    requests++
    state.ui.isLoading = true
  }

  function end () {
    requests--
    state.ui.isLoading = requests > 0
  }
}
