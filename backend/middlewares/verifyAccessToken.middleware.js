import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import createError from "../error.js";
dotenv.config();

const verifyToken = async (req, res, next) => {
    try {
        console.log(req.cookies);
        const token = req.cookies.access_token;
        console.log(token);
        if (!token) {
            return next(createError(StatusCodes.UNAUTHORIZED, "You are not authorized!"));
        }
        jsonwebtoken.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET,
            (error, user) => {
                if (error) {
                    return next(createError(StatusCodes.FORBIDDEN, "Token is not valid!"));
                }
                req.user = user.id;
                next();
            }
        )
    } catch (error) {
        console.log(error);
        next(createError(StatusCodes.INTENAL_SERVER_ERROR, "Server error, we are fixing it."))
    }
}

export default verifyToken;