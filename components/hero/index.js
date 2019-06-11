var html = require('choo/html')
var { loader, className } = require('../base')

module.exports = hero
module.exports.loading = loading

function hero (props) {
  var img = Object.assign({}, props.image)
  delete img.src

  return html`
    <div class="${className('Hero', { 'Hero--image': props.image })}">
      ${props.image ? html`
        <figure class="Hero-figure">
          <img class="Hero-image Hero-image--${img.width > img.height ? 'landscape' : 'portrait'}" ${img} src="${props.image.src}">
        </figure>
      ` : null}
      <div class="Hero-body">
        <div class="u-container u-medium">
          <h1 class="Hero-title">
            ${props.label ? html`<span class="Hero-label">${props.label}</span>` : null}
            ${props.title}
          </h1>
          <div class="Hero-description">
            <div class="Text">
              ${props.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

function loading (opts = {}) {
  return html`
    <div class="${className('Hero', { 'Hero--image': opts.image })}">
      ${opts.image ? html`
        <figure class="Hero-figure">
          <div class="Hero-image u-loading"></div>
        </figure>
      ` : null}
      <div class="Hero-body u-container u-small">
        <h1 class="Hero-title">
          <span class="Hero-label">${loader(5)}</span>
          ${loader(16)}
        </h1>
        <div class="Hero-description">${loader(80)}</div>
      </div>
    </div>
  `
}
