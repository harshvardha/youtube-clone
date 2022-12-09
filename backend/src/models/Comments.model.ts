import { Schema, model } from "mongoose";

const commentsSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    videoId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    likes: {
        type: Array,
        default: [],
    },
    dislikes: {
        type: Array,
        default: []
    },
    replies: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "Users"
            },
            description: {
                type: String,
                required: true
            },
            likes: {
                type: Array,
                default: []
            },
            dislikes: {
                type: Array,
                default: []
            }
        }
    ]
}, { timestamps: true })

export default model("Comments", commentsSchema)