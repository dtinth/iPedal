
var pedal = require('./ipedal').client('http://localhost:10001/')

pedal.on('down', function() {
  console.log('pedal is down')
})

pedal.on('up', function() {
  console.log('pedal is up')
})



