import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./db";
const PORT = 3000;
const app = express();

app.use(cors())
app.use(express.json())
app.post("/create", async (req: Request, res: Response) => {
  console.log(req.body);
  const { username } = req.body;
  const user = await db.user.create({ data: { username: username } });
  res.status(200).json({ user })
});

app.listen(3000, () => {
  console.log(`Server running on port ${PORT}`);
});
