import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes/routes";

const app = express();

app.use(express.json());
app.use(cors());

/// Route
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "⚡ Welcome to Digital Wallet Server..",
  });
});

export default app;
