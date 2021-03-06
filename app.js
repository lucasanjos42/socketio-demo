var app = require('express')();
var http = require('http').Server(app);
var server = app.listen(5001);
var io = require('socket.io').listen(server);
var express = require('express');

var clients = {}; 

app.use('/', express.static(__dirname + '/front'));

io.on("connection", function (client) {  
    client.on("join", function(name){
    	console.log("Joined: " + name);
        clients[client.id] = name;
        client.emit("update", "You have connected to the server.");
        client.broadcast.emit("update", name + " has joined the server.")
    });

    client.on("send", function(msg){
    	console.log("Message: " + msg);
        client.broadcast.emit("chat", clients[client.id], msg);
    });

    client.on("disconnect", function(){
    	console.log("Disconnect");
        io.emit("update", clients[client.id] + " has left the server.");
        delete clients[client.id];
    });
});


http.listen(5000, function(){
  console.log('listening on port 5000');
});
