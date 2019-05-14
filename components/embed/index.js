var assert = require('assert')
var html = require('choo/html')
var player = require('./player')
var { i18n } = require('../base')

var text = i18n(require('./lang.json'))

// match short and long youtube links
// https://www.youtube.com/watch?foo=bar&v=WwE7TxtoyqM&bin=baz
// https://youtu.be/gd6_ZECm58g
var YOUTUBE_RE = /https?:\/\/(?:www.)?youtu\.?be(?:\.com\/watch\?(?:.*?)v=|\/)(.+?)(?:&|$)/

module.exports = embed
module.exports.id = id

function embed (props) {
  assert(props.src, 'figure: src string is required')
  var attrs = Object.assign({ alt: props.title }, props)
  delete attrs.src
  return html`
    <figure class="Embed">
      <img class="Embed-image" ${attrs} src="${props.src}">
      ${props.title ? html`<figcaption class="Embed-title">${props.title}</figcaption>` : null}
      <a class="Embed-link" href="${props.url}" target="_blank" rel="noopener noreferrer" onclick=${onclick}>
        <span class="u-hiddenVisually">${text`Play ${props.title || ''}`}</span>
      </a>
    </figure>
  `

  function onclick (event) {
    player.render(props.url)
    event.preventDefault()
  }
}

// extract unique embed id
// obj -> str
function id (props) {
  switch (props.provider_name) {
    case 'YouTube': return props.embed_url.match(YOUTUBE_RE)[1]
    case 'Vimeo': return props.embed_url.match(/vimeo\.com\/(.+)?\??/)[1]
    default: return null
  }
}
