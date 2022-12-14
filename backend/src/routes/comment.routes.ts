import { Router } from "express";
import { check } from "express-validator";
import {
    addComment,
    deleteComment,
    deleteReplyComment,
    dislikeComment,
    dislikeReplyComment,
    getComments,
    likeComment,
    likeReplyComment,
    replyToComment,
    updateComment,
    updateReplyComment
} from "../controllers/comment.controllers";
import verifyToken from "../middlewares/verifyAccessToken.middleware";

const commentRouter = Router();

commentRouter.post(
    "/add",
    [
        check("description").isLength({ min: 1 })
    ],
    verifyToken,
    addComment);
commentRouter.delete("/delete/:commentId", verifyToken, deleteComment);
commentRouter.get("/getComments/:videoId", getComments);
commentRouter.put("/like/:commentId", verifyToken, likeComment);
commentRouter.put("/dislike/:commentId", verifyToken, dislikeComment);
commentRouter.patch("/update/:commentId", verifyToken, updateComment);
commentRouter.post(
    "/reply/:commentId",
    [
        check("description").isLength({ min: 1 })
    ],
    verifyToken,
    replyToComment);
commentRouter.put("/reply/like/:commentId", verifyToken, likeReplyComment);
commentRouter.put("/reply/dislike/:commentId", verifyToken, dislikeReplyComment);
commentRouter.patch("/reply/update/:commentId", verifyToken, updateReplyComment);
commentRouter.delete("/reply/delete/:commentId", verifyToken, deleteReplyComment);

export default commentRouter;