import { Schema, model } from "mongoose";

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
        requried: true
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
    },
    fromGoogle: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export default model("Users", userSchema);