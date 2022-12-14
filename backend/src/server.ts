import express from "express";
import { connect } from "mongoose";
import cors from "cors";
import CustomError from "./types/CustomError";
import { Request, Response, NextFunction } from "express";
import userRouter from "./routes/user.routes";
import authenticationRouter from "./routes/authentication.routes";
import commentRouter from "./routes/comment.routes.js";
import videoRouter from "./routes/video.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT: string | 5000 = process.env.PORT || 5000;
const MONGO_DB_URI: string = process.env.DATABASE_URI || "";

app.use(cors({
    origin: "*"
}));
app.use(express.json());

app.use("/authentication", authenticationRouter);
app.use("/users", userRouter);
app.use("/comments", commentRouter);
app.use("/videos", videoRouter);

app.use((error: CustomError, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    });
})

connect(MONGO_DB_URI)
    .then(result => {
        console.log("connected to mongoDB");
    })
    .catch(error => {
        console.log(error);
    })

app.listen(PORT, () => {
    console.log(`Server Started at port ${PORT}`);
})