import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import Video from "../models/Video.js";
import createError from "../error.js";

const addVideo = async (req, res, next) => {
    try {
        const newVideo = await Video.create({
            userId: req.user,
            ...req.body
        })
        res.status(StatusCodes.OK).json(newVideo);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return next(createError(StatusCodes.NOT_FOUND, "Video not found."));
        }
        if (req.user === video.userId) {
            const updatedUser = await Video.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, { new: true });
            res.status(StatusCodes.OK).json(updatedUser);
        } else {
            next(createError(StatusCodes.BAD_REQUEST, "Invalid user id."));
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return next(createError(StatusCodes.NOT_FOUND, "Video not found!"));
        }
        if (req.user.id === video.userId) {
            await Video.findByIdAndDelete(req.params.id);
            res.status(StatusCodes.OK).json({ message: "The video has been deleted." });
        } else {
            return next(createError(StatusCodes.FORBIDDEN, "You can delete only your video!"));
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        res.status(StatusCodes.OK).json(video);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const addView = async (req, res, next) => {
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

const getRandomVideos = async (req, res, next) => {
    try {
        const randomVideos = await Video.aggregate([{ $sample: { size: 40 } }]);
        res.status(StatusCodes.OK).json(randomVideos);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getTrendingVideos = async (req, res, next) => {
    try {
        const trendingVideos = await Video.find().sort({ views: -1 });
        res.status(StatusCodes.OK).json(trendingVideos);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getSubscribedChannelVideos = async (req, res, next) => {
    try {
        const user = await User.findById(req.user);
        const subscribedChannels = user.subscribedUsers;
        const list = await Promise.all(
            subscribedChannels.map((channelId) => {
                return Video.find({ userId: channelId });
            })
        );
        res.status(StatusCodes.OK).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getVideoByTag = async (req, res, next) => {
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

const search = async (req, res, next) => {
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