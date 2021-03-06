var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')
var { offset, vh, className } = require('../base')

module.exports = class Zigzag extends Component {
  constructor (id, state, emit, opts = {}) {
    super(id)
    this.local = state.components[id] = Object.assign({ id, inview: 0 }, opts)
    if (!opts.static) this.load = this.init
  }

  update () {
    return true
  }

  init (el) {
    var top, height, viewport
    var onscroll = nanoraf(function () {
      var { scrollY } = window
      var min = top
      var max = top + height - viewport
      if (scrollY + viewport < min || scrollY > max) return
      var ratio = (scrollY + viewport - min) / height
      el.style.setProperty('--Zigzag-inview', ratio.toFixed(3))
    })
    var onresize = nanoraf(function () {
      top = offset(el)
      height = el.offsetHeight
      viewport = vh()
      onscroll()
    })

    window.requestAnimationFrame(function () {
      onresize()
      window.addEventListener('scroll', onscroll, { passive: true })
      window.addEventListener('resize', onresize)
    })

    this.afterupdate = onresize
    this.unload = function () {
      window.removeEventListener('scroll', onscroll)
      window.removeEventListener('resize', onresize)
    }
  }

  createElement (children, opts) {
    return html`
      <div class="${className('Zigzag', { 'Zigzag--static': this.local.static })}" id="${this.local.id}" style="--Zigzag-inview: ${this.local.inview};">
        ${children.map((child) => html`<div class="Zigzag-item">${child}</div>`)}
        ${opts ? button(opts) : null}
      </div>
    `
  }
}

function button (props) {
  var attrs = Object.assign({ class: 'Zigzag-button' }, props)
  delete attrs.text
  if (attrs.external) {
    delete attrs.external
    attrs.rel = 'noopener noreferrer'
    attrs.target = '_blank'
  }
  if (attrs.href) return html`<a ${attrs}>${props.text}</a>`
  return html`<button ${attrs}>${props.text}</button>`
}
