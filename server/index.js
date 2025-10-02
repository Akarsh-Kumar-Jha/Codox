const express = require('express');
const http = require('http');
const app = express();
const connectRedis = require('./config/redisConnection');
const server = http.createServer(app);
const { Server } = require('socket.io');
const {connectDB} = require('./config/dbConnection');
const userRoutes = require('./routes/userRoutes');
const router = require('./routes/userRoutes');
const cors = require('cors');  
const cookieParser = require('cookie-parser');
const serverless = require("serverless-http");
require('dotenv').config();
const io = new Server(server,{
    cors: {
        origin: "*",
    }
});
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["https://codoox.netlify.app"], // exactly your Netlify URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
app.options("*", cors());
let redis;
(async() => {
    redis = await connectRedis()
})();
const userMap = {

};
const userAvatarMap = {};


const getAllConnectedClients = (roomId) => {
    console.log("getting all connected clients...");
    console.log(Array.from(io.sockets.adapter.rooms.get(roomId)) || []);
   const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
   return clients.map((client) => {
       return {
           id: client,
           username: userMap[client],
           avatar: userAvatarMap[client]
       }
   })
}

io.on('connection', (socket) => {
    console.log('a user connected',socket.id);

    socket.on('join-room',async({roomId,username,avatar}) => {
        console.log('User joined room',roomId,username,avatar);
        userMap[socket.id] = username;
        userAvatarMap[socket.id] = avatar;
        socket.join(roomId);
        const prevCode = await redis.get(roomId) || '';
        socket.emit('prev-code',prevCode);
       const connectedClientsData = getAllConnectedClients(roomId);
       console.log("connectedClientsData",connectedClientsData);
           socket.to(roomId).emit('user-connected',{
               id: socket.id,
               username: userMap[socket.id],
       })
       io.to(roomId).emit('connected-clients',connectedClientsData);
    })

    socket.on('lang-change', (lang) => {
        console.log("Language changed to:", lang);
        socket.broadcast.emit('language-changed', lang);
    });


    socket.on('code-change', async({value,roomId}) => {
        console.log("Code changed to:", value);
        await redis.set(roomId, value);
         socket.broadcast.emit('code-updated', value);
    });


socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach((room) => {
        const clientsOfRoom = Array.from(io.sockets.adapter.rooms.get(room) || []);
         socket.to(room).emit('user-disconnected', userMap[socket.id]);
    })
});

});

app.use('/',(req,res) => {
    res.send('<h1>Hello Coders!</h1>');
})
app.use('/api/v1',userRoutes);

module.exports = app;
module.exports.handler = serverless(app);