import expressSession from "express-session";
import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./modules/routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import notFound from "./middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport";
const app = express();
app.use(
  expressSession({
    secret: "Your Secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(cors());
// app.use((req, res, next) => {
//   console.log("➡️ Incoming:", req.method, req.originalUrl);
//   console.log("Body:", req.body);
//   next();
// });
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Digital Wallet Backend!!",
  });
});
app.use(globalErrorHandler);
app.use(notFound);
export default app;
