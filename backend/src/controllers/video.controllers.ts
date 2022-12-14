import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import User from "../models/User.model";
import Video from "../models/Video.model";
import CustomError from "../errors/CustomError";

const addVideo = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const newVideo = await Video.create({
            userId: req.user.id,
            ...req.body
        })
        res.status(StatusCodes.OK).json(newVideo);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const updateVideo = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return next(new CustomError(StatusCodes.NOT_FOUND, "Video not found."));
        }
        if (req.user.id === video.userId) {
            const updatedUser = await Video.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.status(StatusCodes.OK).json(updatedUser);
        } else {
            next(new CustomError(StatusCodes.BAD_REQUEST, "Invalid user id."));
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const deleteVideo = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return next(new CustomError(StatusCodes.NOT_FOUND, "Video not found!"));
        }
        if (req.user.id === video.userId) {
            await Video.findByIdAndDelete(req.params.id);
            res.status(StatusCodes.OK).json({ message: "The video has been deleted." });
        } else {
            return next(new CustomError(StatusCodes.FORBIDDEN, "You can delete only your video!"));
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getVideo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const video = await Video.findById(req.params.id);
        res.status(StatusCodes.OK).json(video);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const addView = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 }
        });
        res.status(StatusCodes.OK).json("The view has been increased.");
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getRandomVideos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const randomVideos = await Video.aggregate([{ $sample: { size: 40 } }]);
        res.status(StatusCodes.OK).json(randomVideos);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getTrendingVideos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const trendingVideos = await Video.find().sort({ views: -1 });
        res.status(StatusCodes.OK).json(trendingVideos);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getSubscribedChannelVideos = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels: any = user?.subscribedUsers;
        const list = await Promise.all(
            subscribedChannels.map((channelId: string) => {
                return Video.find({ userId: channelId });
            })
        );
        res.status(StatusCodes.OK).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getVideoByTag = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const tags = req.query.tags.split(",");
        console.log(tags);
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);
        res.status(StatusCodes.OK).json(videos);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const search = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query.q;
        console.log("search: ", query);
        const videos = await Video.find({
            title: { $regex: query, $options: "i" }
        }).limit(40);
        res.status(StatusCodes.OK).json(videos);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export {
    addVideo,
    updateVideo,
    deleteVideo,
    getVideo,
    addView,
    getRandomVideos,
    getTrendingVideos,
    getSubscribedChannelVideos,
    getVideoByTag,
    search
};