var html = require('choo/html')
var { Elements } = require('prismic-richtext')
var { srcset, src } = require('../base')
var embed = require('../embed')

module.exports = serialize

function serialize (type, node, content, children) {
  switch (type) {
    case Elements.paragraph: {
      if (node.text === '' || node.text.match(/^\s+$/)) {
        return html`<!-- Empty paragraph node removed -->`
      }
      return null
    }
    case Elements.embed: {
      let provider = node.oembed.provider_name.toLowerCase()
      let id = embed.id(node.oembed)

      return embed({
        url: node.oembed.embed_url,
        title: node.oembed.title,
        src: src(id, 900, { type: provider }),
        width: node.oembed.thumbnail_width,
        height: node.oembed.thumbnail_height,
        sizes: '(min-width: 39em) 39em, 100vw',
        srcset: srcset(id, [400, 900, 1800], { type: provider })
      })
    }
    case Elements.image: {
      let sizes = [400, 600, 800, 1200].map(function (size, index) {
        return Math.min(size, node.dimensions.width * (index + 1))
      })
      let source = node.url
      let attrs = Object.assign({ alt: node.alt || '' }, node.dimensions)
      if (!/\.svg$/.test(node.url)) {
        attrs.sizes = '(min-width: 39em) 39em, 100vw'
        attrs.srcset = srcset(node.url, sizes)
        source = src(node.url, 800)
      }
      let caption = []
      if (node.alt) caption.push(node.alt)
      if (node.copyright) caption.push(node.copyright)

      return html`
        <figure>
          <img ${attrs} src="${source}">
          ${caption.length ? html`
            <figcaption class="Text-caption">${caption.join(' ')}</figcaption>
          ` : null}
        </figure>
      `
    }
    default: return null
  }
}
