import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;


const startServer = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://mongodb:mongodb@cluster0.d3h8n.mongodb.net/digitalWallet?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    server = app.listen(5000, () => {
      console.log(`⚡ Server is running on port: 5000.`);
    });
  } catch (error) {
    console.log(`❌ Error: ${error}`);
    process.exit(1);
  }
};

startServer();

