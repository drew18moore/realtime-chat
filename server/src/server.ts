import express, { Request, Response } from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { db } from "./db";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import { corsOptions } from "./config/corsOptions";
import messagesRouter from "./routes/messages";

const PORT = 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5173"]
  }
});

app.use(cors<Request>(corsOptions));
app.use(express.json());

app.post("/friend", async (req: Request, res: Response) => {
  const { userId1, userId2 } = req.body;
  try {
    const userUpdatedUser1 = await db.user.update({
      where: { id: userId1 },
      data: {
        friends: {
          connect: { id: userId2 },
        }
      }
    })
    const userUpdatedUser2 = await db.user.update({
      where: { id: userId2 },
      data: {
        friends: {
          connect: { id: userId1 },
        },
        friendOf: {
          connect: { id: userId1 },
        }
      }
    })
    res.status(200).json({ message: "Friend added" });
  } catch (err) {
    res.status(500).json(err)
  }
});

app.get("/friends", async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await db.user.findUnique({
      where: { id: Number(userId) },
      include: { friends: true }
    })
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json(err)
  }
})

app.use("/api/auth", authRouter)
app.use("/api/users", usersRouter)
app.use("/api/messages", messagesRouter)

server.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
})
