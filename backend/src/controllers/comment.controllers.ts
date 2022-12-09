import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/CustomError.js";
import Comment from "../models/Comments.model";
import Video from "../models/Video.model";

const addComment = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "Please provide a proper description."));
        }
        const userId = req.user.id;
        const videoId = req.params.videoId;
        const { description } = req.body;
        const newComment = await Comment.create({
            userId,
            videoId,
            description
        });
        res.status(StatusCodes.CREATED).json({ message: "Comment added" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const deleteComment = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user.id;
        const comment: any = await Comment.findById(commentId).populate("videoId");
        if (userId === comment.userId.toString() || userId === comment.video.userId.toString()) {
            await Comment.findByIdAndDelete(commentId);
            res.status(StatusCodes.OK).json({ message: "Comment Deleted." });
        } else {
            next(new CustomError(StatusCodes.FORBIDDEN, "You can only delete your comment."));
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const comments = await Comment.find({ videoId: req.params.videoId });
        res.status(StatusCodes.OK).json(comments);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const likeComment = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        if (!comment?.likes.includes(userId)) {
            await comment?.updateOne({
                $push: { likes: userId },
                $pull: { dislikes: userId }
            });
            res.status(StatusCodes.OK).json({ message: "Comment liked." });
        }
        else {
            await comment?.updateOne({
                $pull: { likes: userId }
            });
            res.status(StatusCodes.OK).json({ message: "Comment like removed." });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const dislikeComment = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        if (!comment?.dislikes.includes(userId)) {
            await comment?.updateOne({
                $push: { dislikes: userId },
                $pull: { likes: userId }
            });
            res.status(StatusCodes.OK).json({ message: "Comment disliked." });
        }
        else {
            await comment.updateOne({
                $pull: { dislikes: userId }
            });
            res.status(StatusCodes.OK).json({ message: "Comment dislike removed." })
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export {
    addComment,
    deleteComment,
    getComments,
    likeComment,
    dislikeComment
}