import express from "express";
import cors from "cors";
import "dotenv/config"
import job from "./lib/cron.js";

const app = express();
const PORT = process.env.PORT || 3000;

job.start();
app.use(express.json());
app.use(cors());



import authRoutes from "./routes/authRoutes.js"
import { connect } from "mongoose";
import { connectDB } from "./lib/db.js";
import bookRoutes from "./routes/bookRoutes.js";
// console.log({PORT});

app.use("/api/auth", authRoutes)
app.use("/api/books", bookRoutes)

app.listen(PORT, () =>{
    console.log("server running");
    connectDB();
})