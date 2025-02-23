import mongoose, { mongo } from "mongoose";

const chatSchema = new mongoose.Schema({
    username: String,
    chat: String,
    timestamp: Date,
});

export const ChatModel = mongoose.model('chat', chatSchema);