
var convoy = require('..')
var assert = require('assert')
var es     = require('event-stream')

var c = convoy()
var d = convoy()

var c1 = c.createStream() //push a stream onto the stack.

var passed = false

c1.write('hello')
c1.end()
c.pipe(d).pipe(c)

d.on('push', function () {
  var d1 = d.createStream()

  d1.pipe(es.writeArray(function (err, ary) {
    assert.deepEqual(ary, ['hello'])
    console.log(ary)
    passed = true
  }))
  d1.resume()
})

c.pipe(es.log('>>'))
//resume makes the stream start in this tick.
c.resume()

assert(passed)

