import { Router } from "express";
import * as authenticationControllers from "../controllers/authentication.controllers";

const authenticationRouter = Router();

// Register User
authenticationRouter.post("/signup", authenticationControllers.signup);

// Sign in user
authenticationRouter.post("/signin", authenticationControllers.signin);

// Google sign in
authenticationRouter.post("/google", authenticationControllers.googleSignIn);

export default authenticationRouter;