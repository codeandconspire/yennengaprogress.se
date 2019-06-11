var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')
var button = require('../button')
var { loader, offset, vh } = require('../base')

var TEST = '(transform: translateX(calc(100% * var(--Landing-offset))))'

module.exports = class Landing extends Component {
  constructor (id, state, emit) {
    super(id)
    this.local = state.components[id] = { id }
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
    if (!window.CSS || !window.CSS.supports(TEST)) return

    var top = offset(el)
    var height = el.offsetHeight
    var isActive = false

    var onscroll = nanoraf(function () {
      var { scrollY } = window
      var min = top
      var max = top + height / 4
      if (!inview()) {
        el.classList.remove('is-inview')
        isActive = false
        return
      }
      if (!isActive) el.classList.add('is-inview')
      isActive = true
      var ratio = Math.max(0, Math.min(1, (scrollY - min) / max))
      el.style.setProperty('--Landing-offset', ratio.toFixed(3))
      el.style.setProperty('--Landing-rotate', (16 * (1 - ratio)).toFixed(3) + 'deg')
    })

    var onresize = nanoraf(function () {
      top = offset(el)
      height = el.offsetHeight
      onscroll()
    })

    if (inview()) {
      isActive = true
      el.classList.add('is-inview')
    }

    onscroll()
    window.addEventListener('scroll', onscroll, { passive: true })
    window.addEventListener('resize', onresize)
    this.unload = function () {
      window.removeEventListener('scroll', onscroll)
      window.removeEventListener('resize', onresize)
    }

    function inview () {
      return top <= window.scrollY + vh() && top + height > window.scrollY
    }
  }

  createElement (props) {
    var img = Object.assign({}, props.image)
    delete img.src

    var link = Object.assign({}, props.link)
    delete link.text

    var format
    if (img.width === img.height) {
      format = 'square'
    } else {
      format = img.width > img.height ? 'landscape' : 'portrait'
    }

    return html`
      <div class="Landing u-container" id="${this.local.id}">
        <div class="Landing-heading">
          ${props.title ? html`<h1 class="Landing-title">${props.title}</h1>` : null}
          ${props.link ? button(Object.assign({ primary: true }, props.link)) : null}
        </div>
        <div class="Landing-background"></div>
        ${props.image ? html`
          <figure class="Landing-figure">
            <div class="Landing-image">
              <img class="Landing-img Landing-img--${format}" ${img} src="${props.image.src}">
            </div>
            ${props.caption ? html`<figcaption class="Landing-caption">${props.caption}</figcaption>` : null}
          </figure>
        ` : null}
      </div>
    `
  }
}

