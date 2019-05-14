var html = require('choo/html')

module.exports = vcard

function vcard (props) {
  var img = Object.assign({}, props.image)
  delete img.src

  return html`
    <article class="VCard">
      ${props.image ? html`
        <figure class="VCard-figure">
          <img class="VCard-image" ${img} src="${props.image.src}">
        </figure>
      ` : null}
      <div class="VCard-body">
        ${props.title || props.label ? html`
          <h3 class="VCard-header">
            ${props.label ? html`<span class="VCard-label">${props.label}</span>` : null}
            ${props.title || null}
          </h3>
        ` : null}
        ${props.body || null}
      </div>
    </article>
  `
}
