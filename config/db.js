import mongoose from "mongoose";

export const connectDb = async () =>{
  await mongoose.connect('mongodb+srv://lalshakhu:555796@cluster0.b8kz73s.mongodb.net/food-del').then(()=>console.log("DB CONNECTED"));
}