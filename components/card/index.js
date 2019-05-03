var html = require('choo/html')
var { snippet, className } = require('../base')

var THEMES = ['sand', 'umber', 'darkBlue']

module.exports = card
module.exports.themes = THEMES

function card (props) {
  var img = Object.assign({}, props.image)
  delete img.src

  var body = props.body
  if (body) {
    if (typeof window === 'undefined') {
      if (Array.isArray(body) || body[0] === '<') html`<div class="Card-text Text">${body}</div>`
      else body = html`<p class="Card-text">${snippet(body, props.truncate || 170)}</p>`
    } else if (Array.isArray(body) || body instanceof window.Element) {
      body = html`<div class="Card-text Text">${body}</div>`
    } else {
      body = html`<p class="Card-text">${snippet(body, props.truncate || 170)}</p>`
    }
  }

  return html`
    <div class="${className('Card', { [`Card--${props.theme}`]: props.theme })}">
      ${props.image ? html`<img class="Card-image" ${img} src="${props.image.src}">` : null}
      <div class="Card-content">
        ${props.label ? html`<span class="Card-label">${props.label}</span>` : null}
        <h2 class="Card-title">${props.title}</h2>
        ${body}
        ${props.link ? link(props.link) : null}
      </div>
    </div>
  `
}

function link (props) {
  var attrs = Object.assign({ class: 'Card-link' }, props)
  delete attrs.text
  if (attrs.external) {
    delete attrs.external
    attrs.rel = 'noopener noreferrer'
    attrs.target = '_blank'
  }
  var children = html`<span class="u-hiddenVisually">${props.text}</span>`
  if (attrs.href) return html`<a ${attrs}>${children}</a>`
  return html`<button ${attrs}>${children}</button>`
}
