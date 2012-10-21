
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
d1.pipe(es.log('>>'))
c.pipe(es.log('c>>'))

c.pipe(d)

c1.write('hello')
c1.end()

var recieved = []

d1.on('data', function (data) {
  recieved.push(data)
})

d.resume()
c.resume()
d1.resume()

assert.deepEqual(recieved, ['hello'])

c2.write('goodbye')
c2.end()

var recieved2 = []

d2.on('data', function (data) {
  console.log('DATA', data)
  recieved2.push(data)
})

d2.resume()

console.log(c.paused)

assert.deepEqual(recieved2, ['goodbye'])

