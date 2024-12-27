import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import mongodb from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRouter.js";

const app = express();
const port = 4000;
const allowedOrigins = ["http://localhost:5173"];

mongodb();
app.use(express.json());
app.use(cors({ credentials: true, origin: allowedOrigins }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("welcome");
});

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(port, () =>
  console.log(`server started on http://localhost:${port}`)
);
