var html = require('choo/html')
var button = require('../button')
var { className } = require('../base')

module.exports = recruit

function recruit (props) {
  return html`
    <div class="Recruit">
      <svg class="Recruit-image" width="375" height="423" viewBox="0 0 375 423">
        <g fill="none" fill-rule="evenodd">
          <ellipse cx="161" cy="160.5" fill="#D5CEBA" fill-rule="nonzero" rx="161" ry="160.5"/>
          <path d="M319 166.4l4-1-4 1z"/>
          <path fill="#BA6740" fill-rule="nonzero" d="M319 166.4l-2.5 1a64.4 64.4 0 0 0-6.5 17.1c-.6 3-.7 6-1.2 9-.9 4.8-3 9.4-5.2 14a173.2 173.2 0 0 1-15 25.9c-.8 1.2-3.1 5.9-3.5 8.4a496.5 496.5 0 0 0-15.3-40.6c-9-20.8-20.2-40.9-26.8-62.6-2-6.6-3.8-13.4-5-20.2l-1.7-9c-5-1-10-2.1-15-2.3 7.3 30.8 12.5 41.7 25.6 71.4 8.8 19.9 18.9 39.3 24.6 60.4 2.8 10.4 4.6 21 6.3 31.7 6.2 38.3 12.3 81.5 8.7 120.2l27.5.6c1.7-15.8-2.5-31.6-3-47.4-.2-6.7.2-13.5-.7-20.1-.7-5.5-2.4-10.9-4.1-16.1l-12.1-38.2c-.8-9 1.4-19.3 4.6-27.8 2-5 4.6-10 6.4-15 2.6-7.5 6-14.5 7.7-22.3 2.7-12.5 5.5-27 10.2-39l-4 1z"/>
          <path fill="#345150" fill-rule="nonzero" d="M365.3 126.1a28 28 0 0 0-25.6-4.6c-6 1.9-11.6 5.8-18 6.2-3.6.3-7.3-.6-11.1-.6a30 30 0 0 0-19.5 8.4c-5.4 4.9-9.6 11-13.7 17a16 16 0 0 0-1.9 3.4c-6.4 17.5 24.2 18.5 33.6 14.5l7.3-3a43.8 43.8 0 0 1 6.5-2l3.3-.4c9.8-.7 19.4 3.8 29.1 2.7 9-1 16.7-8.4 18.7-17.3a25 25 0 0 0-8.7-24.3zM248.2 110.6C275 109.4 302.9 93.8 323 74c8.6-8.5 17-20.1 15.5-33.1-1.8-15.2-15.9-24-28.6-28.9-10.2-4-21.3-7.1-31.8-3.8-9.8 3.2-19.5 12-29 7.9-4-1.8-7-5.6-10.9-8-10.9-6.8-24.2 0-35.2 6.8-7.4 4.6-15 9.4-20.8 16.6-4.5 5.7-8.4 13.4-15 14.8-2.2.5-4.4.2-6.6.3-6.2.2-12.1 3-17.6 6.3a38.6 38.6 0 0 0-14.6 13.8c-3.4 6.2-4.2 14.7-.7 20.8 1.7 2.8 4.2 4.9 6.8 6.8a88 88 0 0 0 41.9 16.7c13.9 1.7 26-2 39.7-3.8 1.7-.2 3.5-.3 5.2-.2 5 .2 10 1.4 15 2.3 4 .9 8 1.2 11.9 1.2zM335 392.5c-1.4 0-2.5-1-2.5-2.4a13 13 0 0 0-1.4-6.2 79 79 0 0 1-1.2-2.7l-1.1-2.6c-1.8-4.1-4-9.3-2.6-13.7.4-1.3 1.8-2 3.1-1.6 1.3.5 2 1.9 1.6 3.2-.9 2.6 1 6.7 2.4 10l1.2 2.8 1.1 2.6c1.2 2.7 1.6 3.9 1.8 8 0 .6-.2 1.3-.6 1.8-.5.5-1 .8-1.7.8h-.2zM345.3 392.5c-1.2 0-2.2-1-2.4-2.1l-1.2-9.2a162.2 162.2 0 0 1-2-33.2c0-1.4 1.2-2.4 2.5-2.4s2.3 1.2 2.3 2.6c-.4 15 .4 20.8 2 32.3l1.2 9.2c.1 1.4-.8 2.6-2 2.8h-.4zM352.3 391c-1.1 0-2.1-.7-2.5-1.7-1.4-4.7-.4-9.1.7-13.7a33.7 33.7 0 0 0 0-19.6c-.3-1.2.5-2.6 1.8-3 1.4-.3 2.8.4 3.3 1.6 2.9 9.2 1.3 16.3 0 22-1 4.2-1.8 7.8-.7 11.3.2.7 0 1.5-.5 2.2-.5.6-1.2 1-2 1zM269.3 391.8h-.1c-.7 0-1.3-.4-1.7-.9-.4-.5-.6-1.1-.6-1.8.8-9.7.5-15.3 0-22.5l-.5-12.6c0-1.4 1-2.5 2.3-2.5a2.5 2.5 0 0 1 2.5 2.4c.1 4.9.4 8.9.6 12.4.4 7 .8 13.2 0 23.2a2.4 2.4 0 0 1-2.5 2.3zM258.9 391.8c-1.2 0-2.2-1-2.4-2.3-.2-2.6-1-5.7-2-8.7-.8-3.2-1.7-6.6-2-9.6-.2-1.4.8-2.7 2-2.9 1.4-.1 2.5 1 2.7 2.3.2 2.6 1 5.7 2 8.7.8 3.2 1.7 6.6 2 9.6.1.7 0 1.4-.5 2-.4.4-1 .8-1.5.9h-.3z"/>
          <g>
            <path d="M114.7 269.6zM110.1 272.3l-.8.5zM110.2 252.6c-.5-1.5-.7-3.1-.6-4.7v-16.8l-6.6 11a262.7 262.7 0 0 0 2.2 32.7h.7l3-1.8.2-.6c1.3-5.5 2.9-11 4.5-15.9a8.4 8.4 0 0 1-3.4-3.9zM113.1 270.5l.9-.5-.9.5zM110.6 272l2.2-1.3-2.2 1.3zM114.2 269.9l.4-.3-.4.3zM49.5 195.2l.8-30.7c-14.6.4-28.3 1-43.5 1.9L6.1 226h42.5l.9-30.8zM166.6 406.9l2.4-.3h-.6l-1.8.3z"/>
            <path fill="#3D312D" fill-rule="nonzero" d="M121.3 201l11.8-6-.2-.2c-2.7-2-5.2-4.2-6.5-7.2-1.4-2.8-1.5-6-1.4-9 0-2.2.4-4.3.8-6.4 4.4 0 16-.1 19.3-2.7.8 1 1.5 2 2 3 .7 1.2 1.2 2.4 1.5 3.7.3 1.4.4 2.9.3 4.3a21 21 0 0 1-5 12.2c-.7 1-1.7 1.9-2.8 2.6l11 6s.2 0 .3-.2l3 2.2 1.2-6c.4-2.3-.6-11.3-.7-16.9 0-6.7-4.2-12.2-7-18.3-.4-1-1-1.9-1.6-2.7-1.5-1.7-3.9-2.3-6-2.6-2.9-.4-5.7-.5-8.6-.4-2.5 0-2.3-.3-4.9 1.8-.7.5-1.3 1-1.8 1.8a36.6 36.6 0 0 0-7.7 23.9l.7 17.5a26 26 0 0 1 1.7-.6l.6.1z"/>
            <path fill="#CAA593" fill-rule="nonzero" d="M144 192.7a21 21 0 0 0 5-12.2c0-1.4 0-2.9-.4-4.3-.3-1.2-.8-2.5-1.4-3.6l-2-3c-3.4 2.5-15 2.7-19.3 2.6-.5 2.1-.8 4.2-.9 6.4-.1 3 0 6.3 1.4 9 1.4 3 3.9 5.3 6.5 7.2l.3.2-11.9 6c5.5 1 7.2 2.6 14 2.4 2.3-.1 13.8-.6 16.8-2l-11-6c1.1-.8 2.1-1.7 3-2.7zM188.3 416.4c-.5-1.1-1.3-2-2.2-2.6l-9.1-7.4c-2.7 0-5.3 0-8 .2l-2.4.3-3.4.6 2 4a13.4 13.4 0 0 0 4.5 5.5 23 23 0 0 0 11.7 4.3c1.7.2 3.4 0 4.9-.7 1.4-.9 2.5-2.6 2-4.2z"/>
            <path fill="#FF9200" fill-rule="nonzero" d="M109.6 248c-.1 1.5.1 3 .6 4.6.7 1.6 1.8 3 3.3 4 1.7 1 3.6 1.8 5.5 2.4 7.9 2.5 32.2 3.8 40.5 3.7 1.3-3.1 2.3-6.4 3-9.7a40.5 40.5 0 0 0-1.6-21.5h.7l9.6-3 3.1-1a46 46 0 0 0-11.2-19c-2.6-2.3-5.1-3.7-7.6-5.3l-3-2c-.2 0-.4 0-.5.2-3 1.4-14.4 1.8-16.9 2-6.7.1-8.4-1.4-13.9-2.5l-.5-.1-1.8.6a58.1 58.1 0 0 0-21 18.1l2.2 2.2 9.4 9.4v16.8z"/>
            <path fill="#CAA593" fill-rule="nonzero" d="M161 231.5l.4 1.2a40.5 40.5 0 0 1 1 20.3c-.6 3.3-1.6 6.6-2.9 9.7-1.4 3.7-3 7.3-4.2 10.7l-.9.2c1.4 1.8 2.6 3.8 3.8 5.8l.6-.3c1.4-3.2 4-7 6.6-10.6 2.3-3.4 4.6-6.8 5.8-9.7 1.6-3.6 1.5-6.7 1.5-10.6 0-9.4 1.7-11-1.4-19.4v-.2l-9.7 2.9h-.7z"/>
            <path fill="#005CD7" fill-rule="nonzero" d="M168.4 406.7h.6c2.7-.3 5.3-.2 8-.3l4.5-.3c-2.8-14.2-7.8-36.9-10.5-51-1.2-6.1-2.3-12.2-3.2-18.3-2.4-18-3-50.2-2.4-68.4-2.6 3.8-5.2 7.5-6.6 10.7l-.7.3c-1-2-2.3-4-3.7-5.9l.8-.1 4.3-10.7A211 211 0 0 1 119 259c-2-.6-3.8-1.4-5.5-2.5-1.6 4.8-3.2 10.4-4.4 16l-.2.5.4-.2.8-.5.5-.3 2.2-1.3.3-.2.9-.5.2-.1.4-.3h.1l7 20.7s-8 4.5-15.7 8.4v.5c-.2 7 0 14.2 0 21.3-.3 30.1-5.3 59.9-4 90a42 42 0 0 1 7.3-.8s13.2.2 13.2.4l6.6.4c3.7-19.8 7.3-40 5.2-60-.8-7.5-2.4-15-3-22.7-.6-10.8 1-21.6 3.5-32 3.2 18.6 8.3 37.5 13.8 55.6 5.5 18 10.1 36.8 9.3 55.7 1.5.8 3.4.7 5.3.4l3.5-.6a16 16 0 0 1 1.7-.2z"/>
            <path fill="#F5E372" fill-rule="nonzero" d="M114.7 269.6l-.5.3-.2.1-.9.5-.3.2-2.2 1.3-.5.3-.8.5-.4.2-3 1.8h-.8c.3 2 2.4 4.2 3 6 .3 1.2.4 2.5.4 3.8 0 1.2-.2 2.5-.7 3.6-.9 1.3-2.4 2-4 1.8-1.5-.2-3-.9-4.1-1.9-.7-.4-1.3-1-1.6-1.7a37.8 37.8 0 0 1-1.6-6l-9 5 6.5 18.4c.2.7 5.5-1.8 11.4-4.8l16.5-8.7-7-20.8h-.2z"/>
            <path fill="#CAA593" fill-rule="nonzero" d="M99.6 288.1c1.2 1 2.6 1.7 4.2 1.9 1.5.2 3-.5 4-1.8.5-1.1.7-2.4.6-3.6 0-1.3 0-2.5-.4-3.8-.5-1.8-2.6-4-2.9-6v-.6c-1.3-6.8-2.2-26.5-2.2-32.1l6.6-11-9.4-9.4-.5.5-3 4c-5 6.3-5.3 14-5.8 22-.2 4.3.8 8.6 1.8 12.8 1.5 6.7 2.5 13 4 19.6.3 2 .8 4 1.4 5.8.4.7 1 1.3 1.6 1.7zM109.3 409.7c-.1 2-2.1 3.3-4.2 3.8-1.9.4-3.6 1.3-5 2.6a6 6 0 0 0-2 3.3c-.2 1.2 0 2.7 1 3.3.6.2 1.2.3 1.7.2 3.5 0 7.3.2 10.4-1.3a40 40 0 0 0 9.7-7.2c.9-1 1.2-3 1.5-4.3 0-.2-13.1-.4-13.1-.4z"/>
          </g>
        </g>
      </svg>
      <div class="Recruit-content">
        ${props.title ? html`<h2 class="Recruit-title">${props.title}</h2>` : null}
        ${props.body || null}
        ${props.actions ? html`
          <div class="Recruit-actions">
            ${props.actions.map((attrs) => html`
              <span class="Recruit-action">
                ${button(attrs)}
              </span>
            `)}
          </div>
        ` : null}
      </div>
    </div>
  `
}
