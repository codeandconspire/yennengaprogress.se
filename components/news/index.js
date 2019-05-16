var html = require('choo/html')
var format = require('date-fns/format')
var button = require('../button')
var { i18n, loader } = require('../base')

var text = i18n()

module.exports = news

function news (props) {
  var items = props.items
  if (!items) {
    items = []
    for (let i = 0; i < 3; i++) items.push(null)
  }

  return html`
    <div class="News ${props.large ? 'News--large' : null}">
      ${props.title ? html`<h2 class="News-title">${props.title}</h2>` : null}
      ${props.body ? html`<div class="News-content"><div class="Text">${props.body}</div></div>` : null}
      <div class="News-items">
        ${items.map(function (item, index) {
          if (!item) return loading(index)
          return html`
            <article class="News-item ${item.appear ? 'u-slideUp' : ''}">
              <time class="News-date" datetime="${JSON.stringify(item.date).replace(/^"|"$/g, '')}">
                ${format(item.date, 'MMMM D, YYYY')}
              </time>
              <h3 class="News-heading">${item.title}</h3>
              ${item.body}
              <a class="News-link" href="${item.href}">
                <span class="u-hiddenVisually">${text`Read more`}</span>
              </a>
            </article>
          `
        })}
      </div>
      ${props.link ? button(props.link) : null}
    </div>
  `
}

function loading (index) {
  return html`
    <article class="News-item is-loading u-slideUp">
      <time class="News-date">${loader(8)}</time>
      <h3 class="News-heading">${loader([12, 16, 14][index % 3])}</h3>
      <p>${loader([80, 110, 100][index % 3])}</p>
    </article>
  `
}
