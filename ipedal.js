#!/usr/bin/env node

exports.server = function() {
  
  var express = require('express')
  var app = express()
  var server = require('http').createServer(app)
  var io = require('socket.io').listen(server)

  io.on('connection', function(socket) {
    socket.on('pressure', function(pressure) {
      io.sockets.emit('pressure', pressure)
    })
  })

  app.use(express.static(__dirname + '/static'))

  return server

}

exports.client = function(url) {

  var EventEmitter = require('events').EventEmitter
  var io = require('socket.io-client')
  var pedal = new EventEmitter()
  var socket = io.connect(url)
  
  socket.on('pressure', function(pressure) {
    var state = pressure > 0 ? 'down' : 'up'
    pedal.pressure = pressure
    pedal.emit('pressure', pressure)
    if (pedal.state != state) {
      pedal.state = state
      pedal.emit(state)
    }
  })

  pedal.socket = socket

  return pedal
  
}

function main() {
  var server = exports.server()
  var port = parseInt(process.env.PORT, 10) || 10001
  server.listen(port)
  console.log('listening on port ' + port)
}

if (require.main == module) {
  main()
}

