import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// register api routers
app.get("/", (_, res) => {
  res.status(200).json({ message: "Hello" });
});

export default app;
