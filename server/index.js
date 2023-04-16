const express = require("express")
const path = require("path")
const app = express()
const PORT = 8080

const server = require("http").createServer(app)
const { Server } = require("socket.io")
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})
app.use(express.static(path.resolve(__dirname, "view")))
app.get("/", (req, res) => {
    return res.sendFile(path.resolve(__dirname, "./view/index.html"))
})

let connectedClients = new Map()
io.on("connection", (socket) => {
    console.log("a user is connected")
    connectedClients.set(socket.id, socket)
    socket.emit("isConnected", { socketID: socket.id, peers: connectedClients.size })


    socket.on("candidate", (data) => {
        socket.broadcast.emit("candidate", { candidate: data.candidate })
    })
    socket.on("offerAnswer", (data) => {
        socket.broadcast.emit("offerAnswer", { sdp: data.sdp })
        if (data.sdp.type === "offer") {
        }
        else {
            const timeInstance = setTimeout(() => {
                socket.emit("callNotPuckUp", true)
            }, 30000)
            if (data.sdp.type === "answer") {
                clearTimeout(timeInstance)
                socket.broadcast.emit("offerAnswer", { sdp: data.sdp })
            }
        }
    })
    socket.on("callReject", (data) => {
        console.log("call", data)
        socket.broadcast.emit("callReject", data)
    })
    socket.on("callNotPick", (data) => {
        socket.broadcast.emit("callNotPick", data)
    })
    //stream ended
    socket.on("onEnded", (data) => {
        console.log({ data })
        socket.broadcast.emit("onEnded", data)
    })
    socket.on("disconnecting", () => {
        connectedClients.delete(socket.id)
    })

    socket.on("disconnect", () => {
        connectedClients.delete(socket.id)
        io.emit("peers", { peers: connectedClients.size })
    })
})
app.get("/", (req, res) => {
    return res.send("jhii")
})

server.listen(PORT, (err) => {
    if (err) {
        console.log("server is not start")
    }
    else {
        console.log("server is start at port", PORT)
    }
})