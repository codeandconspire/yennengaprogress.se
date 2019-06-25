/* global gtag */

module.exports = join

function join (state, emitter) {
  state.join = {
    error: null,
    isLoading: false,
    success: false,
    data: null
  }

  emitter.on('join', function (data) {
    state.join.isLoading = true
    state.join.success = false
    state.join.error = null
    state.join.data = data
    emitter.emit('render')

    window.fetch('/api/join', {
      method: 'POST',
      body: data,
      headers: {
        'Accept': 'application/json'
      }
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok) throw new Error(data.message)
        state.join.isLoading = false
        state.join.success = true
        state.join.data = null
        emitter.emit('render')
        gtag('event', 'sign_up', { method: 'Join form' })
      })
    }).catch(function (err) {
      state.join.isLoading = true
      state.join.error = err
      emitter.emit('render')
    })
  })
}
