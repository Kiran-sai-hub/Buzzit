import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import http from 'http';
import { connectToMongoose } from './config/mongooseconfig.js';
import { ChatModel } from './chat/chat.schema.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// 1. Create http server
const server = http.createServer(app);

// 2. Create a socket server 
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST'],
    }
});

// 3. Use socket Events
io.on("connection", (socket)=>{
    console.log("Connection is established");

    socket.on("join", (data)=>{
        socket.username = data;
        // console.log(socket);

        ChatModel.find().sort({timeStamp: 1}).limit(10) // this is a promise 
        // if resolved will give an array of messages set in database...
            .then((messages)=>{
                socket.emit('load_messages', messages);// we will send those messages
            }).catch((err)=>{
                console.log(err);
            })
    })

    socket.on('new_message', (message)=>{
        const userMessage = {
            username: socket.username,
            message: message,
        }

        const newChat = new ChatModel({
            username: socket.username,
            chat: message,
            timestamp: new Date(),
        });

        newChat.save();

        socket.broadcast.emit('broadcast_message', userMessage);
    })
    socket.on('disconnect', ()=>{
        console.log("Disconnected");
    })
});

// 4. listen the server
const PORT = process.env.PORT || 3400;

server.listen(PORT, ()=>{
    console.log(`Server is listening on ${PORT}`);
    connectToMongoose();
})