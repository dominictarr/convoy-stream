
var convoy = require('..')
var fs = require('fs')
var opts = require('optimist').alias('u', 'unpack').argv
var es = require('event-stream')

if(!module.parent) {
  //if user is not streaming input, pack args.
  if(process.stdin.isTTY) {
    var c = convoy()
    c.pipe(process.stdout)

    var manifest = c.createStream()
    manifest.write(
      JSON.stringify({type: 'pack-stream', files: opts._}) + '\n'
    )
    manifest.end()

    opts._.forEach(function (f) {
      fs.createReadStream(f).pipe(c.createStream())
    })

  } 
  //if user is streaming input, then 
  else {
    var c = convoy()
    var manifest
    process.stdin.pipe(c)

    var ms = c.createStream() //manifest
      .resume()
      .on('data', console.log)
      .pipe(es.join(function (err, str) {
        console.log('>>', str)
        manifest = JSON.parse(str)
      }))

    c.on('push', function () {
//      c.createStream().on('data',console.log)
      var name = manifest.files.shift()
      console.log(name)
  //    c.createStream().on('data',console.log)
      c.createStream().pipe(fs.createWriteStream(name))
    })
    
  }
}
