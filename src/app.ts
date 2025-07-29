import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";




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


app.use(globalErrorHandler);
app.use(notFound)

export default app;
