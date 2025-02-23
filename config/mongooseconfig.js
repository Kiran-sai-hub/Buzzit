import mongoose, { connect } from "mongoose";
import dotenv from 'dotenv';
dotenv.config(); // Load env variables


const url = process.env.DB_URL;

export const connectToMongoose = async()=>{
    await mongoose.connect(url);
    console.log("Mongoose is configured");
}