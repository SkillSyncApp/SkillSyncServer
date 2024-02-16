import express, { Express } from "express";
import mongoose from "mongoose";
import BaseRouter from "./routes/index"
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server, Socket } from 'socket.io';

dotenv.config();

const initApp = async (): Promise<Express> => {
  try {
    await mongoose.connect(process.env.DB_URL);
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);

        
/************************************************************************************
 *                              Set socket io
 ***********************************************************************************/

io.on("connection", async (socket) => {
  console.log("A user connected", socket.id);

  socket.on("chat message", async (message) => {
    console.log("message from client", JSON.parse(message));
    // TODO save message to DB by calling sendMessage endpoint
    io.emit("chat message", JSON.stringify(message));
  });
  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});
    
/************************************************************************************
                                Set basic express settings
 ***********************************************************************************/

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Add APIs
    app.use("/api", BaseRouter)

    mongoose.connection.once("open", () => console.log("Connected to Database"));
    mongoose.connection.on("error", (error) => console.error(error));

    return app;
  } catch (error) {
    throw new Error(`Error initializing app: ${error.message}`);
  }
}
export default initApp;
