# choo-data-fetching-demo

## To start

```
$ git clone git@github.com:fraserxu/choo-data-fetching-demo.git
$ cd choo-data-fetching-demo
$ npm install
$ npm start
```

Go to `http://localhost:8000/`

## Solution 1

Use `onload` hook
* first render will be `state.params.id`
* data will be fecthed only once
* If switch from page 1 to page 2, `onload` is not get callled, thus could not fetch data.

```js
var html = require('choo/html')
var choo = require('choo')

var app = choo()
app.use(productStore)
app.route('/:id', mainView)
app.mount('body')

function mainView (state, emit) {
  return html`
    <body onload=${() => emit('fetchProduct')}>
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

```

## Solution 2

Set a `loaded` flag.
* first render will alwasy be 0
* If switch from page 1 to page 2, `fetch` is get callled but **only once**, will get correct value
* If continue switch page, `fetch` in not called anymore

```js
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
```

## Soluction 3

Trigger fetch in `mainView` function
* first render will alwasy be 0
* switch from page to page will get correct value but will also run into infinite render loop

```js
function mainView (state, emit) {
  emit('fetchProduct')

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
```
