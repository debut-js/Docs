var Renderer = require('docsify-server-renderer')
var readFileSync = require('fs').readFileSync

// init
var renderer = new Renderer({
  template: readFileSync('./index.template.html', 'utf-8'),
  config: {
    name: 'Debut',
    repo: 'https://github.com/debut-js/Strategies',
  }
})

renderer.renderToString('./docs/')
  .then(html => {
      console.log(html);
  })
  .catch(err => {
      console.log(err);
  })