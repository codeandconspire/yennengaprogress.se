var html = require('choo/html')
var grid = require('../grid')
var { i18n } = require('../base')

var text = i18n()

module.exports = footer

function footer (contact, support, sections) {
  return html`
    <footer class="View-footer">
      <div class="View-support u-container u-textCenter">
        ${support}
      </div>
      <div class="View-space u-container">
        ${grid({ size: { md: '1of2', lg: '1of4' } }, [
          html`
            <address>
              <a class="View-home u-spaceB2" href="/" title="${text`Go to homepage`}">
                <svg class="View-logo" width="142" height="64" viewBox="0 0 142 64">
                  <g fill="#FFF" fill-rule="nonzero">
                    <path d="M17 29V.6h15v4.3H21.6v7.7h9.3v4.3h-9.3v7.7H32V29zM45.3 29l-6.5-16.4V29h-4.3V.6h4.3l6.5 16.6V.6h4.2V29zM62.8 29l-6.5-16.4V29H52V.6h4.3l6.5 16.6V.6H67V29zM69.5 29V.6h15v4.3H74v7.7h9.3v4.3H74v7.7h10.6V29zM97.8 29l-6.5-16.4V29H87V.6h4.3l6.5 16.6V.6h4.2V29zM115.2 17H112v-4.3h7.5v8.4c0 5-2.5 8.4-7.5 8.4-6 0-7.5-4.5-7.5-8.4V8.4c0-4.9 2.4-8.3 7.5-8.3 6.3 0 7.5 4.5 7.5 8.3V9h-4.3v-.5c0-1.2 0-4.2-3.2-4.2-3.3 0-3.3 3-3.3 4.2v12.7c0 1.2 0 4.2 3.3 4.2 3.2 0 3.2-3 3.2-4.2V17zM132.7 29l-.9-5.6h-5.6l-.8 5.6h-4.3L125.6.6h7l4.3 28.4h-4.2zm-5.8-9.6h4.3L129 4.8 127 19.4zM12.5 34.8c5.7 0 8.1 4.1 8.1 8 0 5.7-3.1 9.1-7.9 9.1H9.8v11.2H5.6V34.8h6.9zM9.8 47.4h2.4c4 0 4.2-3.3 4.2-4.5 0-1-.5-4-4-4H9.9v8.5zM33.7 50.6l3.8 12.5h-4.6l-3.4-11.4h-2.8V63h-4.2V34.8h6.8c5.8 0 8.2 4 8.2 8.1 0 3.7-1.4 6.4-3.8 7.7zm-4.6-3.2c3.9 0 4.1-3 4.1-4.4 0-1.2-.5-4-3.9-4h-2.6v8.4h2.4zM54.6 42.6v12.7c0 4.9-2.5 8.4-7.5 8.4s-7.5-3.5-7.5-8.4V42.6c0-4.9 2.5-8.3 7.5-8.3s7.5 3.6 7.5 8.3zm-4.2 0c0-1.2 0-4-3.3-4-3.2 0-3.3 2.8-3.3 4v12.7c0 1.2.1 4.1 3.3 4.1 3.2 0 3.3-2.9 3.3-4V42.5zM67.9 51.1h-3.3V47h7.6v8.4c0 5-2.5 8.4-7.6 8.4-6 0-7.4-4.6-7.4-8.4V42.6c0-4.9 2.4-8.3 7.4-8.3 6.3 0 7.6 4.5 7.6 8.3v.5h-4.3v-.5c0-1.2 0-4.2-3.3-4.2-3.2 0-3.2 3-3.2 4.2v12.7c0 1.2 0 4.2 3.2 4.2s3.3-3 3.3-4.2v-4.2zM85.9 50.6l3.7 12.5h-4.5l-3.4-11.4h-2.8V63h-4.3V34.8h6.9c5.7 0 8.1 4 8.1 8.1 0 3.7-1.3 6.4-3.7 7.7zm-4.7-3.2c4 0 4.2-3 4.2-4.4 0-1.2-.6-4-4-4H79v8.4h2.3zM92 63.1V34.8h15v4.3H96.7v7.7h9.2v4.3h-9.2v7.7H107v4.3zM113.5 55.3c0 1.4.3 4.2 3.4 4.2 3 0 3.4-3 3.4-4 0-1.1-.5-3.3-3.5-4.6-4.9-2.2-7.4-3.5-7.4-8.7 0-5 2.4-8 7.5-8 6 0 7.5 4.6 7.5 8.4v1h-4.1v-1c0-1.2-.4-4.2-3.4-4.2-3.6 0-3.4 3.2-3.4 4.1 0 1.4.8 2.9 3.8 4 3.6 1.5 7.1 3.3 7.1 9 0 5-2.5 8.2-7.5 8.2-6 0-7.5-4.5-7.5-8.4v-2.5h4.1v2.5zM131 55.3c0 1.4.3 4.2 3.4 4.2 3 0 3.4-3 3.4-4 0-1.1-.5-3.3-3.5-4.6-4.9-2.2-7.4-3.5-7.4-8.7 0-5 2.4-8 7.5-8 6 0 7.5 4.6 7.5 8.4v1h-4.1v-1c0-1.2-.4-4.2-3.4-4.2-3.6 0-3.4 3.2-3.4 4.1 0 1.4.7 2.9 3.8 4 3.6 1.5 7.1 3.3 7.1 9 0 5-2.5 8.2-7.5 8.2-6 0-7.5-4.5-7.5-8.4v-2.5h4.1v2.5zM9.9 16.9V29H5.4V16.9L.1.6h4.5zM8.1.6l3.3 10.2L14.8.6z"/>
                  </g>
                </svg>
              </a>
              ${contact}
            </address>
          `
        ].concat(sections.map((section) => html`
          <div>
            <h2 class="View-heading">${section.heading}</h2>
            <ul>
              ${section.items.map((props) => html`
                <li>
                  <a class="View-shortcut" href="${props.href}" onclick=${props.onclick}>
                    ${props.label}
                    ${props.external ? html`
                      <svg class="View-symbol" width="19" height="19" viewBox="0 0 19 19" aria-hidden="true">
                        <g fill="currentColor" fill-rule="evenodd">
                          <path class="View-arrow" d="M14.4 4.7l-6.7 6.7-.7-.7L13.7 4H9.4V3h6v6h-1V4.7z"/>
                          <path d="M15 16v-3h1v4H2V3h4v1H3v12h12z"/>
                        </g>
                      </svg>
                    ` : null}
                  </a>
                </li>
              `)}
            </ul>
          </div>
        `)))}
      </div>
    </footer>
  `
}
