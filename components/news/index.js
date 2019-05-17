var assert = require('assert')
var html = require('choo/html')
var format = require('date-fns/format')
var { i18n, loader } = require('../base')

var text = i18n()

module.exports = news

function news (id, items = []) {
  assert(typeof id === 'string', 'news: id should be type string')
  return html`
    <div class="News" id="${id}">
      ${items.map(function (item, index) {
        if (!item) return loading(index)
        return html`
          <article class="News-item ${item.appear ? 'u-slideUp' : ''}">
            <time class="News-date" datetime="${JSON.stringify(item.date).replace(/^"|"$/g, '')}">
              ${format(item.date, 'MMMM D, YYYY')}
            </time>
            <h3 class="News-heading">${item.title}</h3>
            ${item.body}
            <a class="News-link" href="${item.href}" onclick=${item.onclick || null}>
              <span class="u-hiddenVisually">${text`Read more`}</span>
            </a>
          </article>
        `
      })}
    </div>
  `
}

function loading (index) {
  return html`
    <article class="News-item is-loading u-slideUp">
      <time class="News-date">${loader(8)}</time>
      <h3 class="News-heading">${loader(8 + 4 * (index % 5))}</h3>
      <p>${loader(60 + 15 * (index % 5))}</p>
    </article>
  `
}
