import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import authenticationRouter from "./routes/authentication.routes.js";
import commentRouter from "./routes/comment.routes.js";
import videoRouter from "./routes/video.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors({
    origin: "*"
}));
app.use(express.json());
app.use(cookieParser());

app.use("/authentication", authenticationRouter);
app.use("/users", userRouter);
app.use("/comments", commentRouter);
app.use("/videos", videoRouter);

app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    })
})

mongoose.connect(process.env.DATABASE_URI)
    .then(result => {
        console.log("connected to mongoDB atlas")
    })
    .catch(error => {
        console.log(error)
    })

app.listen(5000, () => {
    console.log("Server Started")
})