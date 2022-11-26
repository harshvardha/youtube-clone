import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    subscribers: {
        type: Number,
        default: 0
    },
    subscribedUsers: {
        type: [String]
    }
}, { timestamps: true })

export default mongoose.model("Users", userSchema);