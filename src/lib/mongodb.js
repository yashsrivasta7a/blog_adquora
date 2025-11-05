import { configDotenv } from "dotenv";
import mongoose from "mongoose";
app.use(configDotenv());

const MONGODB_URI = process.env.MONGODB_URI;
if(!MONGODB_URI) throw new Error("Missing MongoDb Uri from env");
let cached = global.mongoose ||  { connection: null, promise: null };

export async function connectDB(){
    if(cached.connection)return cached.connection;
    if(!cached.promise){
       cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.connection = await cached.promise;
  return cached.connection;
}