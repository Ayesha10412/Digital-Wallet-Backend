import expressSession from "express-session";
import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./modules/routes";
const app = express();
app.use(
  expressSession({
    secret: "Your Secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.originalUrl);
  console.log("Body:", req.body);
  next();
});
app.use("/api/v1", router);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Digital Wallet Backend!!",
  });
});
export default app;
