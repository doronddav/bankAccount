var Port = process.env || 5000;
var express = require("express");
var app = express();

var http = require("http");
var server = http.Server(app);

app.use(express.static("client"));

server.listen(Port, function () {
  console.log("chat server runing");
});

var io = require("socket.io")(server);

io.on("connection", function (socket) {
  socket.on("message", function (msg) {
    io.emit("message", msg);
  });
});
