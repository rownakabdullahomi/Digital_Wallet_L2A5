import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { notFound } from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import envVars from "./app/config/env";
import "./app/config/passport";




const app = express();

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());
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
