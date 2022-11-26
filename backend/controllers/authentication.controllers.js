import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { compareSync, hashSync, genSaltSync } from "bcrypt";
import createError from "../error.js";
import User from "../models/User.js";
dotenv.config();


const signup = async (req, res, next) => {
    try {
        const salt = genSaltSync(10);
        const hash = hashSync(req.body.password, salt);
        const newUser = new User({ ...req.body, password: hash });
        await newUser.save();
        res.status(StatusCodes.CREATED).json({ message: "User has been created" });
    } catch (error) {
        console.log(error)
        next(createError(StatusCodes.INTERNAL_SERVER_ERROR, "Server Error, We are fixing it."));
    }
}

const signin = async (req, res, next) => {
    try {
        const user = await User.find({ name: req.body.name });
        if (!user) {
            return next(createError(StatusCodes.NOT_FOUND, "User not found."));
        }
        const isCorrect = compareSync(req.body.password, user[0].password);
        if (!isCorrect) {
            return next(createError(StatusCodes.NOT_FOUND, "Wrong Credentials."));
        }
        const accessToken = jsonwebtoken.sign({
            id: user[0]._id
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20m" });
        const { password, ...others } = user[0]._doc;
        console.log("others: ", password);
        res.cookie("access_token", accessToken, {
            httpOnly: true
        }).status(StatusCodes.OK).json(others);
    } catch (error) {
        console.log(error);
        next(createError(StatusCodes.INTERNAL_SERVER_ERROR), "Server Error, We are fixing it.");
    }
}

const googleSignIn = async (req, res, next) => {
    try {

    } catch (error) {
        console.log(error);
        next(createError(StatusCodes.INTERNAL_SERVER_ERROR, "Server error, We are fixing it."));
    }
}

export {
    signup,
    signin,
    googleSignIn
}