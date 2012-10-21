
var convoy = require('..')
var assert = require('assert')
var es     = require('event-stream')

var c = convoy()
c.on('data', console.log)
var d = convoy()
var c1 = c.createStream() //push a stream onto the stack.
var c2 = c.createStream() //push a stream onto the stack.
var d1 = d.createStream()
var d2 = d.createStream()

var drained = false

d1.pipe(es.log('>>'))
c.pipe(es.log('c>>'))

c.pipe(d)

//should pause if this is not the next stream!
assert.equal(c2.write('goodbye'), false)

c2.on('drain', function () {
  drained = true
  assert.equal(c2.write('pork pie'), true)
  c2.end()
})

//this is the first stream. 
//so it's okay to write to this.
assert.equal(c1.write('hello'), true)
c1.end()

var recieved = []

d1.on('data', function (data) {
  recieved.push(data)
})

c.resume()
d1.resume()

assert.deepEqual(recieved, ['hello'])

var recieved2 = []

d2.on('data', function (data) {
  recieved2.push(data)
})

d2.resume()

assert.equal(drained, true, 'drain must be emitted')
assert.deepEqual(recieved2, ['goodbye', 'pork pie'])

