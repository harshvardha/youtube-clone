import mongoose, { Schema } from "mongoose";

const commentsSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    videoId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true })

export default mongoose.model("Comments", commentsSchema)