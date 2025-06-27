import express, { Request } from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import { corsOptions } from "./config/corsOptions";
import messagesRouter from "./routes/messages";
import conversationsRouter from "./routes/conversations";
import { credentials } from "./middleware/credentials";
import cookieParser from "cookie-parser";
import { allowedOrigins } from "./config/allowedOrigins";
import { createClient } from "redis";
import { WSMessage, WSReaction } from "./types";
require('dotenv').config();

const APPID = process.env.APPID || "default-app-id";
const PORT = 3000;
const activeUsers = new Set<number>();

const subscriber = createClient({ url: "redis://redis:6379" });
const publisher = createClient({ url: "redis://redis:6379" });

subscriber.on("error", (err) => console.error("Redis Subscriber Error", err));
publisher.on("error", (err) => console.error("Redis Publisher Error", err));

subscriber.connect();
publisher.connect();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
  },
});

app.use(credentials);
app.use(cors<Request>(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/conversations", conversationsRouter);

server.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
});

subscriber.pSubscribe("conversation:*", (message, channel) => {
  const parsed: (WSMessage | WSReaction) & { senderSocketId: string } = JSON.parse(message);
  const [, conversationId, type] = channel.split(":");

  if (!activeUsers.has(parsed.recipientId) ) return;

  if (type === "reaction") {
    io.to(conversationId).emit("receive-reaction", parsed);
  } else {
    if ("senderSocketId" in parsed) {
      io.to(conversationId).except(parsed.senderSocketId).emit("receive-message", parsed);
    } else {
      io.to(conversationId).emit("receive-message", parsed);
    }
  }
});

io.on("connection", (socket) => {
  const id = socket.handshake.query.id as string;
  
  console.log("WELCOME", id, "to the server", APPID);
  activeUsers.add(parseInt(id));
  socket.join(id);

  io.to(socket.id).emit("online-users", Array.from(activeUsers));
  socket.broadcast.emit("user-connected", parseInt(id));

  socket.on("send-message", async (payload: WSMessage) => {
      console.log("SENDING TO REDIS:", payload);
      // socket.to(payload.conversationId.toString()).emit("receive-message", payload);
      await publisher.publish(`conversation:${payload.conversationId}`, JSON.stringify({ ...payload, senderSocketId: socket.id }));
    }
  );

  socket.on(
    "react-to-message",
    async (payload: WSReaction) => {
      // socket.to(payload.conversationId.toString()).emit("receive-reaction", payload);
      await publisher.publish(`conversation:${payload.conversationId}:reaction`, JSON.stringify({ ...payload, senderSocketId: socket.id }));
    }
  );

  socket.on("join-conversation", (conversationId: string | number) => {
    socket.join(conversationId.toString());
  });

  socket.on("leave-conversation", (conversationId: string | number) => {
    socket.leave(conversationId.toString());
  });

  socket.on("disconnect", () => {
    activeUsers.delete(parseInt(id));
    socket.broadcast.emit("user-disconnected", parseInt(id));
  });
});
