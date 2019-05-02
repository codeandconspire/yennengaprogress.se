var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')
var { loader, offset } = require('../base')

module.exports = class Landing extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id
  }

  static loading () {
    return html`
      <div class="Landing is-loading">
        <div class="Landing-heading"></div>
        ${background()}
        <figure class="Landing-figure">
          <div class="Landing-image"></div>
          <figcaption class="Landing-caption">${loader(20)}</figcaption>
        </figure>
      </div>
    `
  }

  load (el) {
    var top = offset(el)
    var height = el.offsetHeight
    var onscroll = nanoraf(function () {
      var { scrollY } = window
      var min = top + height * 0.1
      var max = top + height / 2
      if (scrollY > height || scrollY < min) return
      var ratio = (scrollY - min) / max
      el.style.setProperty('--Landing-offset', ratio.toFixed(3))
    })

    onscroll()
    window.addEventListener('scroll', onscroll, { passive: true })
    this.unload = function () {
      window.removeEventListener('scroll', onscroll)
    }
  }

  createElement (props) {
    var img = Object.assign({}, props.image)
    delete img.src

    var link = Object.assign({}, props.link)
    delete link.text

    return html`
      <div class="Landing" id="${this.id}">
        <div class="Landing-heading">
          ${props.title ? html`<h1 class="Landing-title">${props.title}</h1>` : null}
          ${props.link ? html`<a class="Landing-button" ${link}>${props.link.text}</a>` : null}
        </div>
        ${background()}
        ${props.image ? html`
          <figure class="Landing-figure">
            <div class="Landing-image">
              <img class="Landing-img" ${img} src="${props.image.src}">
            </div>
            ${props.caption ? html`<figcaption class="Landing-caption">${props.caption}</figcaption>` : null}
          </figure>
        ` : null}
      </div>
    `
  }
}

function background () {
  return html`
    <div class="Landing-background">
      <svg class="Landing-angle" width="300" height="900" viewBox="0 0 300 900">
        <path fill="currentColor" fill-rule="evenodd" d="M300 0v900H0z"/>
      </svg>
    </div>
  `
}
