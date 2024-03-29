var html = require('choo/html')
var { i18n, className } = require('../base')

var text = i18n()

module.exports = header

function header (items, href) {
  return html`
    <header class="View-header">
      <div class="u-container">
        <div class="View-nav">
          <a class="View-home" href="/">
            <svg class="View-logo" width="198" height="66" viewBox="0 0 198 66">
              <g fill="currentColor" fill-rule="nonzero">
                <path d="M17.9 30V.6h15.7v4.5h-11v8h9.7v4.4h-9.7v8h11V30zM47.4 30l-6.8-16.9V30h-4.4V.6h4.4l6.8 17.2V.6h4.5V30zM65.8 30l-7-16.9V30h-4.3V.6h4.4l6.9 17.2V.6h4.4V30zM72.8 30V.6h15.8v4.5H77.5v8h9.7v4.4h-9.7v8h11V30zM102.4 30l-6.8-16.9V30H91V.6h4.5l6.8 17.2V.6h4.4V30zM120.7 17.5h-3.4v-4.3h7.8v8.7c0 5-2.6 8.6-7.8 8.6-6.3 0-7.9-4.7-7.9-8.6V8.7c0-5 2.6-8.6 7.9-8.6 6.6 0 7.8 4.6 7.8 8.6v.5h-4.4v-.5c0-1.2 0-4.3-3.4-4.3s-3.4 3-3.4 4.3v13.1c0 1.3 0 4.4 3.4 4.4 3.3 0 3.4-3.1 3.4-4.3v-4.4zM139 30l-1-5.8h-5.8l-.8 5.8h-4.5L131.5.6h7.3l4.6 29.4H139zm-6.1-10h4.5l-2.2-15-2.3 15zM62.3 36c6 0 8.5 4.3 8.5 8.3 0 5.9-3.3 9.4-8.2 9.4h-3v11.6H55V36h7.2zm-2.8 13h2.6c4.2 0 4.3-3.4 4.3-4.6 0-1-.5-4-4-4h-2.9V49zM84.6 52.4l3.9 12.9h-4.8l-3.5-11.8h-3v11.8h-4.5V36H80c6 0 8.6 4.2 8.6 8.4 0 3.8-1.4 6.6-4 8zM79.7 49c4 0 4.3-3.3 4.3-4.6 0-1.3-.5-4.2-4-4.2h-2.8v8.8h2.5zM106.4 44.1v13.1c0 5-2.6 8.7-7.8 8.7-5.3 0-7.9-3.6-7.9-8.7V44.1c0-5 2.6-8.6 7.9-8.6 5.2 0 7.8 3.7 7.8 8.6zm-4.4 0c0-1.2 0-4.3-3.4-4.3s-3.4 3-3.4 4.3v13.1c0 1.3 0 4.3 3.4 4.3 3.3 0 3.4-3 3.4-4.3V44.1zM120.3 52.9H117v-4.4h7.9v8.7c0 5-2.6 8.7-7.9 8.7-6.3 0-7.8-4.7-7.8-8.7V44.1c0-5 2.6-8.6 7.8-8.6 6.6 0 7.9 4.6 7.9 8.6v.5h-4.5v-.5c0-1.3 0-4.3-3.4-4.3-3.3 0-3.4 3-3.4 4.3v13.1c0 1.3 0 4.3 3.4 4.3s3.4-3 3.4-4.3V53zM139.2 52.4l3.9 12.9h-4.8l-3.5-11.8h-3v11.8h-4.4V36h7.2c6 0 8.5 4.2 8.5 8.4 0 3.8-1.4 6.6-4 8zm-4.9-3.3c4 0 4.3-3.3 4.3-4.6 0-1.3-.5-4.2-4-4.2h-2.8v8.8h2.5zM145.7 65.3V36h15.7v4.4h-11v8h9.7v4.5h-9.7v7.9h11v4.5zM168.1 57.2c0 1.4.3 4.3 3.6 4.3 3.2 0 3.5-3 3.5-4 0-1.2-.5-3.5-3.7-4.9-5-2.2-7.7-3.5-7.7-9 0-5 2.5-8.1 7.9-8.1 6.3 0 7.8 4.6 7.8 8.6v1h-4.3v-1c0-1.3-.3-4.3-3.5-4.3-3.8 0-3.6 3.3-3.6 4.2 0 1.4.8 3 4 4.2 3.7 1.5 7.4 3.3 7.4 9.3 0 5-2.6 8.4-7.8 8.4-6.4 0-7.9-4.7-7.9-8.7v-2.6h4.3v2.6zM186.4 57.2c0 1.4.3 4.3 3.6 4.3 3.2 0 3.5-3 3.5-4 0-1.2-.5-3.5-3.6-4.9-5.1-2.2-7.8-3.5-7.8-9 0-5 2.6-8.1 7.9-8.1 6.3 0 7.9 4.6 7.9 8.6v1h-4.4v-1c0-1.3-.3-4.3-3.5-4.3-3.8 0-3.6 3.3-3.6 4.2 0 1.4.8 3 4 4.2 3.8 1.5 7.5 3.3 7.5 9.3 0 5-2.6 8.4-8 8.4-6.2 0-7.8-4.7-7.8-8.7v-2.6h4.3v2.6zM10.4 17.5V30H5.7V17.5L.1.6h4.7zM8.5.6L12 11.2 15.5.6z"/>
              </g>
            </svg>
            <div class="u-hiddenVisually">${text`Home page`},</div>
          </a>
          <nav class="View-menu">
            <span>
              <a href="https://whistlesecure.com/yennengaprogress" target="_blank" rel="noopener noreferrer" class="${className('View-link', { 'View-link--light': href === ''})}">
                Whistleblowing
              </a>
            </span>
            ${items.map((props, index) => html`
              <span>
                <a href="${props.href}" class="${className('View-link', { 'View-link--light': href === '', [`View-link--${props.type.toLowerCase()}`]: props.type })}" onclick=${props.onclick}>
                  ${props.label}
                </a>${(index + 1) < items.length ? html`<span class="u-hiddenVisually">,</span>` : null}
              </span>
            `)}
            <a class="View-link View-link--light View-link--flag" href="https://sv.yennengaprogress.se">
              <svg role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"><path fill="#006aa7" d="M0,0H16V10H0Z"/><path fill="#fecc00" d="M0,4H5V0H7V4H16V6H7V10H5V6H0Z"/></svg>
              Sidan på svenska
            </a>
          </nav>
        </div>
      </div>
    </header>
  `
}
