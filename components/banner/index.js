var html = require('choo/html')

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
      ${props.button ? button(props.button) : null}
    </div>
  `
}

function button (props) {
  var attrs = Object.assign({ class: 'Banner-button' }, props)
  delete attrs.text
  if (props.external) {
    delete attrs.external
    attrs.rel = 'noopener noreferrer'
    attrs.target = '_blank'
  }
  if (attrs.href) return html`<a ${attrs}>${props.text}</a>`
  return html`<button ${attrs}>${props.text}</button>`
}
