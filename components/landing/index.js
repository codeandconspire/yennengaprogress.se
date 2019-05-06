var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')
var button = require('../button')
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
        <div class="Landing-background"></div>
        <figure class="Landing-figure">
          <div class="Landing-image"></div>
          <figcaption class="Landing-caption">${loader(20)}</figcaption>
        </figure>
      </div>
    `
  }

  update () {
    return false
  }

  load (el) {
    var top = offset(el)
    var height = el.offsetHeight
    var isBellow = false
    var onscroll = nanoraf(function () {
      var { scrollY } = window
      var min = top
      var max = top + height / 2
      if (scrollY > max) {
        if (!isBellow) el.style.setProperty('--Landing-offset', 1)
        isBellow = true
        return
      }
      if (scrollY < min) return
      isBellow = false
      var ratio = Math.max(0, Math.min(1, (scrollY - min) / max))
      el.style.setProperty('--Landing-offset', ratio.toFixed(3))
    })
    var onresize = nanoraf(function () {
      top = offset(el)
      height = el.offsetHeight
      if (!isBellow) el.style.removeProperty('--Landing-offset')
      onscroll()
    })

    onscroll()
    window.addEventListener('scroll', onscroll, { passive: true })
    window.addEventListener('resize', onresize)
    this.unload = function () {
      window.removeEventListener('scroll', onscroll)
      window.removeEventListener('resize', onresize)
    }
  }

  createElement (props) {
    var img = Object.assign({}, props.image)
    delete img.src

    var link = Object.assign({}, props.link)
    delete link.text

    return html`
      <div class="Landing u-container" id="${this.id}">
        <div class="Landing-heading">
          ${props.title ? html`<h1 class="Landing-title">${props.title}</h1>` : null}
          ${props.link ? button(Object.assign({ primary: true }, props.link)) : null}
        </div>
        <div class="Landing-background"></div>
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

