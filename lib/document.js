var dedent = require('dedent')
var hyperstream = require('hstream')

module.exports = document

function document () {
  return hyperstream({
    'meta[name="viewport"]': {
      content: 'width=device-width, initial-scale=1, viewport-fit=cover'
    },
    head: {
      _prependHtml: dedent`
        <link rel="prefeconnect" href="https://yennengaprogress.cdn.prismic.io">
      `,
      _appendHtml: dedent`
        <link rel="stylesheet" href="https://use.typekit.net/ugl4huw.css">
        <meta property="og:site_name" content="Yennenga Progress">
        <script>
          document.documentElement.setAttribute('scripting-enabled', '');
          window.onerror = function () {
            document.documentElement.removeAttribute('scripting-enabled');
            document.documentElement.setAttribute('scripting-initial-only', '');
          }
        </script>
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-140411804-1"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-140411804-1');
        </script>
        <script type="text/javascript">
          (function() {
            var otto_script = document.createElement("script"); otto_script.type = "text/javascript";
            var http = (document.location.protocol == "https:" ? "https://" : "http://");
            otto_script.src = http + "yennengaprogress.info/otto/trk/pixel.js?t=" + new Date().getTime();
            document.getElementsByTagName("head")[0].appendChild(otto_script);
          })();
        </script>
        <link rel="shortcut icon" href="/favicon.ico">
        <link rel="apple-touch-icon" href="/tile-512.png">
      `
    }
  })
}
