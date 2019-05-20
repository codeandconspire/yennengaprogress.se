var html = require('choo/html')
var { i18n, className } = require('../base')

var text = i18n()

exports.input = function (props) {
  var attrs = Object.assign({}, props)
  attrs.class = className('Form-control', {
    [`Form-control--${props.type}`]: props.type
  })
  delete attrs.label
  if (!attrs.type) attrs.type = 'text'
  if ('disabled' in attrs && !attrs.disabled) delete attrs.disabled
  return field(props, html`<input ${attrs}>`)
}

exports.textarea = function (props) {
  var attrs = Object.assign({}, props)
  delete attrs.value
  delete attrs.label
  attrs.class = 'Form-control Form-control--textarea'
  if ('disabled' in attrs && !attrs.disabled) delete attrs.disabled
  return field(props, html`<textarea ${attrs}>${props.value || ''}</textarea>`)
}

exports.select = function (props) {
  var attrs = Object.assign({}, props)
  delete attrs.label
  delete attrs.options
  attrs.class = 'Form-control Form-control--select'
  return field(props, html`
    <select ${attrs}>
      ${props.options.map(function option (props) {
        if (props.options) {
          return html`
            <optgroup label="${props.label}">
              ${props.options.map(option)}
            </optgroup>
          `
        }
        var attrs = Object.assign({}, props)
        delete attrs.label
        return html`<option ${attrs}>${props.label}</option>`
      })}
    </select>
  `)
}

exports.field = field
function field (props, children) {
  var attrs = {
    class: className('Form-field', {
      [props.class]: props.class
    })
  }
  if (props.id) attrs.for = props.id

  return html`
    <label ${attrs}>
      <span class="Form-label">
        ${props.label + (props.required ? '*' : ` (${text`optional`})`)}
      </span>
      ${children}
    </label>
  `
}
