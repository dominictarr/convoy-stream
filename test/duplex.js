
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

function greet (stream) {
  stream.on('data', function (hi) {
    assert.equal(hi, 'HI')
    stream.end()
  })
  stream.write('HI')
}

c.pipe(d).pipe(c)

c.pipe(es.log('>>'))
d.pipe(es.log('>>'))

es.from('abcdefghijklmnopqrstuvwxyz'.split(''))
  .pipe(c2)

d2.pipe(es.writeArray(function (err, ary) {
  console.log(ary)
}))

greet(c1)
greet(d1)


