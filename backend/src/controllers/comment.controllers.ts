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
        await Comment.create({
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

const updateComment = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "Please provide proper description."));
        }
        const userId = req.user.id;
        const commentId = req.params.id;
        const comment = await Comment.findById(commentId);
        if (comment?.userId === userId) {
            await comment?.updateOne({
                $set: { description: req.body.description }
            });
            res.status(StatusCodes.OK).json({ message: "Comment Updated" });
        }
        else {
            next(new CustomError(StatusCodes.UNAUTHORIZED, "You are only authorized to update your comments."));
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const replyToComment = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "Please provide proper description."));
        }
        const userId = req.user.id;
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        await comment?.updateOne({
            replies: { $set: { userId: userId, description: req.body.description } }
        })
        res.status(StatusCodes.OK).json({ message: "Reply added." });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const likeReplyComment = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        const replyComment = comment?.replies.find((reply: any) => reply._id.toString() === req.body.replyCommentId);
        if (replyComment?.dislikes.includes(userId)) {
            replyComment.dislikes = replyComment.dislikes.filter(dislike => dislike !== userId);
        }
        replyComment?.likes.push(userId);
        res.status(StatusCodes.OK).json({ message: "Like added." });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const dislikeReplyComment = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        const replyComment = comment?.replies.find((reply: any) => reply._id.toString() === req.body.replyCommentId);
        if (replyComment?.likes.includes(userId)) {
            replyComment.likes = replyComment.likes.filter(like => like !== userId);
        }
        replyComment?.dislikes.push(userId);
        res.status(StatusCodes.OK).json({ message: "Dislike added." });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const updateReplyComment = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        const replyComment = comment?.replies.find((reply: any) => reply._id.toString() === req.body.replyCommentId);
        if (replyComment && replyComment.userId.toString() === userId) {
            replyComment.description = req.body.description;
            res.status(StatusCodes.OK).json({ message: "Reply updated." });
        }
        else if (!replyComment) {
            return next(new CustomError(StatusCodes.NOT_FOUND, "Reply Comment Not Found."));
        }
        else if (replyComment.userId.toString() === userId) {
            next(new CustomError(StatusCodes.UNAUTHORIZED, "You can only update your comment."));
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const deleteReplyComment = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        const replyComments = comment?.replies;
        const filterdReplyComments = replyComments?.filter((reply: any) => {
            if (reply._id.toString() === req.body.replyCommentId) {
                if (reply.userId.toString() !== userId) {
                    throw new CustomError(StatusCodes.UNAUTHORIZED, "You are only allowed to delete your comments.");
                }
            }
            else {
                return reply;
            }
        })
        await comment?.updateOne({
            $set: { replies: filterdReplyComments }
        });
        res.status(StatusCodes.OK).json({ message: "Comment Deleted." });
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
    dislikeComment,
    updateComment,
    replyToComment,
    likeReplyComment,
    dislikeReplyComment,
    updateReplyComment,
    deleteReplyComment
}