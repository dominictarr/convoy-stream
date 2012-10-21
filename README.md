# convoy-stream

<img src=https://secure.travis-ci.org/'Dominic Tarr'/convoy-stream.png?branch=master>

A meta-stream for sending multiple streams down a single stream. Like 
[mux-demux](https://github.com/dominictarr/mux-demux) except in series
instead of in parallel.

`convoy-stream` is useful in different cases to mux-demux for example,
replicating multiple files down a stream, or packing multiple files
into one file.

`convoy-stream` uses length packed frames, so binary data is also supported!

## A Simple Example

``` js
var convoy = require('..')
var assert = require('assert')
var es     = require('event-stream')

var c = convoy()
var d = convoy()

var c1 = c.createStream() //push a stream onto the stack.

c1.write('hello')
c1.end()

//pipe the convoys together.
c.pipe(d)

var d1 = d.createStream()
d1.on('data', console.log.bind(console))
```

## License

MIT
