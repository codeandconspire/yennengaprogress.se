var html = require('choo/html')
var Component = require('choo/component')

module.exports = class Anchor extends Component {
  constructor (id) {
    super(id)
    this.id = id
  }

  update () {
    return false
  }

  load (el) {
    if (window.location.hash.substr(1) === this.id) {
      el.scrollIntoView()
    }
  }

  createElement () {
    return html`<span id="${this.id}"></span>`
  }
}
