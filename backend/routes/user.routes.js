import { Router } from "express";
import {
    deleteUser,
    dislikeVideo,
    getUser,
    likeVideo,
    subscribeChannel,
    unsubscribeChannel,
    updateUser
} from "../controllers/user.controllers.js";
import verifyToken from "../middlewares/verifyAccessToken.middleware.js";

const userRouter = Router();

// update user
userRouter.put("/update/:id", verifyToken, updateUser);

// delete user
userRouter.delete("/delete/:id", verifyToken, deleteUser);

// get a user
userRouter.get("/find/:id", getUser);

// subscribe a channel
userRouter.put("/subscribe/:id", verifyToken, subscribeChannel);

// unsubscribe a channel
userRouter.put("/unsubscribe/:id", verifyToken, unsubscribeChannel);

// like a video
userRouter.put("/like/:videoId", verifyToken, likeVideo);

// unlike a video
userRouter.put("/dislike/:videoId", verifyToken, dislikeVideo);

export default userRouter;