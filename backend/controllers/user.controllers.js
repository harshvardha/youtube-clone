import { StatusCodes } from "http-status-codes";
import createError from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

const updateUser = async (req, res, next) => {
    if (req.params.id === req.user) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },
                { new: true }
            );
            res.status(StatusCodes.OK).json(updatedUser);
        } catch (error) {
            console.log(error);
            next(error);
        }
    } else {
        return next(createError(StatusCodes.FORBIDDEN, "You can only delete your account!"));
    }
}

const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(StatusCodes.OK).json({ message: "User deleted" });
        } catch (error) {
            console.log(error);
            next(error);
        }
    } else {
        return next(createError(StatusCodes.FORBIDDEN, "You can only delete your account!"));
    }
}

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const subscribeChannel = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user, {
            $push: { subscribedUsers: req.params.id }
        });
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 }
        });
        res.status(StatusCodes.OK).json({ message: "Subscription Successfull." });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const unsubscribeChannel = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user, {
            $pull: { subscribedUsers: req.params.id }
        });
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 }
        });
        res.status(StatusCodes.OK).json({ message: "Unsubscribe Successfull." });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const likeVideo = async (req, res, next) => {
    try {
        const userId = req.user;
        const videoId = req.params.videoId;
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { likes: userId },
            $pull: { dislikes: userId }
        });
        res.status(StatusCodes.OK).json({ message: "The video has been liked." });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const dislikeVideo = async (req, res, next) => {
    try {
        const userId = req.user;
        const videoId = req.params.videoId;
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: userId },
            $pull: { likes: userId }
        });
        res.status(StatusCodes.OK).json({ message: "The video has been disliked." });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export {
    updateUser,
    deleteUser,
    getUser,
    subscribeChannel,
    unsubscribeChannel,
    likeVideo,
    dislikeVideo
}