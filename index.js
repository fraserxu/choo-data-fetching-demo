var html = require('choo/html')
var choo = require('choo')

var app = choo()
app.use(productStore)
app.route('/:id', mainView)
app.mount('body')

var loaded = false
function mainView (state, emit) {
  if (!loaded) {
    loaded = true
    emit('fetchProduct')
  }

  return html`
    <body>
      <h1>
        <a href='/1'>1</a>
        <a href='/2'>2</a>
        <a href='/3'>3</a>
        product is ${state.product}
      </h1>
    </body>
  `
}

function productStore (state, emitter) {
  state.product = 0
  emitter.on('DOMContentLoaded', function () {
    emitter.on('fetchProduct', function () {
      setTimeout(function () {
        console.log('fetch....')
        state.product = state.params.id
        emitter.emit('render')
      }, 1000)
    })
  })
}
