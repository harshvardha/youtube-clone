import { Router } from "express";
import verifyToken from "../middlewares/verifyAccessToken.middleware.js";
import {
    addVideo,
    updateVideo,
    deleteVideo,
    getVideo,
    addView,
    getTrendingVideos,
    getRandomVideos,
    getSubscribedChannelVideos,
    getVideoByTag,
    search,
} from "../controllers/video.controllers.js";

const videoRouter = Router();

videoRouter.post("/", verifyToken, addVideo);
videoRouter.put("/:id", verifyToken, updateVideo);
videoRouter.delete("/:id", verifyToken, deleteVideo);
videoRouter.get("/find/:id", getVideo);
videoRouter.put("/addView/:id", addView);
videoRouter.get("/trendingVideos", getTrendingVideos);
videoRouter.get("/randomVideos", getRandomVideos);
videoRouter.get("/subscribedChannelVideos", verifyToken, getSubscribedChannelVideos);
videoRouter.get("/tags", getVideoByTag);
videoRouter.get("/search", search);

export default videoRouter;