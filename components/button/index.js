var html = require('choo/html')
var { className } = require('../base')

module.exports = button

function button (props) {
  var attrs = Object.assign({
    class: className('Button', {
      'Button--primary': props.primary,
      'Button--fill': props.fill
    })
  }, props)
  delete attrs.fill
  delete attrs.primary
  delete attrs.text
  if (props.external) {
    delete attrs.external
    attrs.rel = 'noopener noreferrer'
    attrs.target = '_blank'
  }
  if (attrs.href) return html`<a ${attrs}>${props.text}</a>`
  return html`<button ${attrs}>${props.text}</button>`
}
