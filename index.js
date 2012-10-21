

var duplex = require('duplex')
var parse = require('message-stream')
//what is the pause state?

/*
  lets say your reading a stack of streams.
  you pop off 1 stream, and the first one starts reading.

  when it finishes, the stream is paused, 
  until the 2nd stream is poped.

  when writing to the stream.

  okay, so the basis is a stream that is paused
*/

module.exports = function () {
  var writing = []
  var reading = []

  var d = duplex()
  var parser = parse(function (data, sep) {
    if(sep === '.') {
      reading[0]._end()
      reading.shift()
    } else {
      if(!reading.length)
        d.emit('push') //means you should create a stream.
                         //else it will error.
      if(!reading.length) {
        return d.emit('error', new Error(
          'no stream to write to'
        ))
      }

      reading[0]._data(data)
      
    }
  })

  d.on('_data', parser)

  d.createStream = function () {
    var p = duplex()
    p.inBuffer = []

    function drain () {
      d._data('0.')
      writing.shift()
      var n = writing[0]

      if(!n) return
      while(n.inBuffer.length) {
        var m = n.inBuffer.shift()
        //null means 'end'
        if(m === null) return drain()
        d._data(m)
      }
      //note, drain will not be emitted if the stream has ended.
      n.emit('drain')
      
    }

    function write (message) {
      if(writing[0] === p) {
        if(message !== null)
          d._data(message)
        else drain()
      }
      else {
        p.inBuffer.push(message)
      }
    }

    p.on('_data', function (data) {
      write(data.length + ',' + data.toString())
    })
    p.on('_end', function () {
      write(null)
    })
    if(writing.length)
      p._pause() //pause the writable side

    writing.push(p)
    reading.push(p)
    return p
  }

  return d
}

