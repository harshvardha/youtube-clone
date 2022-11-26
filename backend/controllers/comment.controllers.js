import { StatusCodes } from "http-status-codes";
import createError from "../error.js";
import Comment from "../models/Comments.js";
import Video from "../models/Video.js";

const addComment = async (req, res, next) => {
    try {
        const newComment = await Comment.create({ ...req.body, userId: req.user });
        res.status(StatusCodes.CREATED).json(newComment);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(res.params.id);
        const video = await Video.findById(res.params.id);
        if (req.user === comment.userId || req.user === video.userId) {
            await Comment.findByIdAndDelete(req.params.id);
            res.status(StatusCodes.OK).json({ message: "Comment Deleted." });
        } else {
            next(createError(StatusCodes.FORBIDDEN, "You can only delete your comment."));
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ videoId: req.params.videoId });
        res.status(StatusCodes.OK).json(comments);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export {
    addComment,
    deleteComment,
    getComments
}