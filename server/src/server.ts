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

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5173"]
  }
});

app.use(credentials);
app.use(cors<Request>(corsOptions));
app.use(express.json());

app.use("/api/auth", authRouter)
app.use("/api/users", usersRouter)
app.use("/api/messages", messagesRouter)
app.use("/api/conversations", conversationsRouter)

server.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
})
