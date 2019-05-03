var html = require('choo/html')
var button = require('../button')

module.exports = banner

function banner (props) {
  if (!props.image) return null
  var attrs = Object.assign({}, props.image)
  delete attrs.src

  return html`
    <div class="Banner">
      <img class="Banner-image" ${attrs} src="${props.image.src}">
      ${props.label || props.title ? html`
        <h2 class="Banner-title">
          ${props.label ? html`<span class="Banner-label">${props.label}</span>` : null}
          ${props.title || null}
        </h2>
      ` : null}
      ${props.button ? button(Object.assign({ fill: true }, props.button)) : null}
    </div>
  `
}
