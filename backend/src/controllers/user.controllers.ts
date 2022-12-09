import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import User from "../models/User.model";
import Video from "../models/Video.model";
import CustomError from "../errors/CustomError";
import { validationResult } from "express-validator";

const updateUser = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { passWord, email } = req.body;
        if (passWord) {
            return next(new CustomError(StatusCodes.EXPECTATION_FAILED, "You cannot update password while updating other fields."));
        }
        if (email) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(new CustomError(StatusCodes.EXPECTATION_FAILED, "Please provide correct email id."));
            }
        }
        const userId: string = req.user.id;
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $set: req.body
        }, { new: true });
        res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const deleteUser = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.user.id;
        if (!userId) {
            return next(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "Please provide correct user id."));
        }
        await User.findByIdAndDelete(userId);
        res.status(StatusCodes.OK).json({ message: "User deleted." });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const subscribeChannel = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: req.params.id },
            $inc: { subscribers: 1 }
        });
        res.status(StatusCodes.OK).json({ message: "Subscription Successfull." });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const unsubscribeChannel = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        await User.findByIdAndUpdate(req.user.di, {
            $pull: { subscribedUsers: req.params.id },
            $inc: { subscribers: -1 }
        });
        res.status(StatusCodes.OK).json({ message: "Unsubscribe Successfull." });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const likeVideo = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.user.id;
        const videoId: string = req.params.videoId;
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

const dislikeVideo = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const userId: string = req.user.id;
        const videoId: string = req.params.videoId;
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