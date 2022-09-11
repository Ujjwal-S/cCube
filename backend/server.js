const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (request, response) =>  {
    response.set("Content-Type", "text/javascript")
    response.render("index.html")
} )

io.on("connection", (socket) => {

    console.log("New WebSocket Connection - socket.id :", socket.id);
    socket.join("Room-1")
    
    socket.on("sendInsert", (saaman) =>{
        socket.broadcast.to("Room-1").emit("receiveInsert", saaman)
    })

    socket.on("sendDelete", (saaman) =>{
        socket.broadcast.to("Room-1").emit("receiveDelete", saaman)
    })

    socket.on("disconnect", () => {
        console.log("WebScoket Connection Disconnected - socket.id :", socket.id);
    });
})

server.listen(8000, () => {
    console.log("**********************************");
    console.log("Server running on Port 8000");
    console.log("***************************");
});
