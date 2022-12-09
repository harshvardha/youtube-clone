import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import CustomError from "../errors/CustomError";
dotenv.config();

const verifyToken = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader?.startsWith("Bearer")) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token." });
        }
        const accessToken: string = authHeader.split(" ")[1];
        if (!accessToken) {
            return next(new CustomError(StatusCodes.UNAUTHORIZED, "You are not authorized!"));
        }
        const accessTokenSecretKey: string = process.env.ACCESS_TOKEN_SECRET || "";
        jsonwebtoken.verify(
            accessToken,
            accessTokenSecretKey,
            (error, user) => {
                if (error) {
                    return next(new CustomError(StatusCodes.FORBIDDEN, "Token is not valid!"));
                }
                req.user = user;
                next();
            }
        )
    } catch (error) {
        console.log(error);
        next(new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, "Server error, we are fixing it."))
    }
}

export default verifyToken;