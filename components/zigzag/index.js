var html = require('choo/html')
var nanoraf = require('nanoraf')
var Component = require('choo/component')
var { offset, vh } = require('../base')

module.exports = class Zigzag extends Component {
  constructor (id, state, emit) {
    super(id)
    this.id = id
  }

  update () {
    return false
  }

  load (el) {
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

    this.unload = function () {
      window.removeEventListener('scroll', onscroll)
      window.removeEventListener('resize', onresize)
    }
  }

  createElement (children, opts) {
    return html`
      <div class="Zigzag" id="${this.id}">
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
