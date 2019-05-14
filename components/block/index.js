var html = require('choo/html')

module.exports = block

function block (props) {
  var img = Object.assign({}, props.image)
  delete img.src

  return html`
    <article class="Block">
      ${props.image ? html`
        <figure class="Block-figure">
          <img class="Block-image" ${img} src="${props.image.src}">
        </figure>
      ` : null}
      ${props.title ? html`<h3 class="Block-title">${props.title}</h3>` : null}
      ${props.body ? html`<div class="Text">${props.body}</div>` : null}
    </article>
  `
}
