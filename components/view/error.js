var html = require('choo/html')
var { i18n } = require('../base')

var text = i18n()

var DEBUG = process.env.NODE_ENV === 'development'
if (typeof window !== 'undefined') {
  try {
    let flag = window.localStorage.DEBUG
    DEBUG = DEBUG || (flag && JSON.parse(flag))
  } catch (err) {}
}

module.exports = error

function error (err, href) {
  return html`
    <main class="View-main View-main--background u-flex u-alignCenter">
      <div class="View-space View-space--hero u-container u-spaceV2">
          <div class="Text">
            <h1>${text`Ouch`}</h1>
            ${message(err.status)}
            ${DEBUG ? html`<pre>${err.stack}</pre>` : null}
          </div>
        </div>
      </div>
    </main>
  `
  function message (status) {
    switch (status) {
      case 404: return html`<p>${text`There is no page at this address. Try finding your way using the menu or from ${html`<a href="/">${text`the homepage`}</a>`}.`}</p>`
      case 503: return html`<p>${text`You seem to be offline. Check your network connection.`}</p><p><a href="${href}" onclick=${reload}>${text`Try again`}</a></p>`
      default: return html`<p>${text`We apologize, an error has occured on our site.`}</p><p><a href="${href}" onclick=${reload}>${text`Try again`}</a></p>`
    }

    function reload (event) {
      window.location.reload()
      event.preventDefault()
    }
  }
}
