import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { compareSync, hashSync, genSaltSync } from "bcrypt";
import CustomError from "../errors/CustomError";
import User from "../models/User.model";
import { validationResult } from "express-validator";
dotenv.config();


const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "Please provide correct email or password."));
        }
        const { name, email, password } = req.body;
        const saltRounds: string = genSaltSync(12);
        const hashedPassword: string = hashSync(password, saltRounds);
        await User.create({
            name,
            email,
            password: hashedPassword
        });
        res.status(StatusCodes.CREATED).json({ message: "User has been created" });
    } catch (error) {
        console.log(error)
        next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, "Server Error, We are fixing it."));
    }
}

const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "Please provide correct email or password."));
        }
        const { email, passWord } = req.body;
        const userFound = await User.findOne({ email: email });
        if (!userFound) {
            return next(new CustomError(StatusCodes.NOT_FOUND, "User not found."));
        }
        const isPasswordCorrect = compareSync(passWord, userFound.password || "");
        if (!isPasswordCorrect) {
            return next(new CustomError(StatusCodes.FORBIDDEN, "Please provide correct email or password."));
        }
        const accessTokenSecretKey: string = process.env.ACCESS_TOKEN_SECRET || "";
        const accessToken = jsonwebtoken.sign({
            id: userFound._id
        }, accessTokenSecretKey, { expiresIn: "20m" });
        const { password, ...others } = userFound;
        res.status(StatusCodes.OK).json({ accessToken, others });
    } catch (error) {
        console.log(error);
        next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, "Server Error, We are fixing it."));
    }
}

const googleSignIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty) {
            return next(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "Please provide correct credentials."));
        }
        const user = await User.findOne({ email: req.body.email });
        const accessTokenSecretKey: string = process.env.ACCESS_TOKEN_SECRET || "";
        if (user) {
            const accessToken = jsonwebtoken.sign({
                id: user._id
            }, accessTokenSecretKey, { expiresIn: "20m" });
            res.status(StatusCodes.OK).json({ accessToken, user });
        }
        else {
            const newUser = await User.create({
                ...req.body,
                fromGoogle: true
            });
            const accessToken = jsonwebtoken.sign({
                id: newUser._id
            }, accessTokenSecretKey, { expiresIn: "20m" });
            res.status(StatusCodes.OK).json({ accessToken, newUser });
        }
    } catch (error) {
        console.log(error);
        next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, "Server error, We are fixing it."));
    }
}

export {
    signup,
    signin,
    googleSignIn
}