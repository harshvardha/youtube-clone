import { Router } from "express";
import { addComment, deleteComment, getComments } from "../controllers/comment.controllers.js";
import verifyToken from "../middlewares/verifyAccessToken.middleware.js";

const commentRouter = Router();

commentRouter.post("/", verifyToken, addComment);
commentRouter.delete("/:commentId", verifyToken, deleteComment);
commentRouter.get("/:videoId", getComments);

export default commentRouter;