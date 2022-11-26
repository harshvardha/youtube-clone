import { Router } from "express";
import { signin, signup, googleSignIn } from "../controllers/authentication.controllers.js";

const authenticationRouter = Router();

// Register User
authenticationRouter.post("/signup", signup);

// Sign in user
authenticationRouter.post("/signin", signin);

// Google sign in
authenticationRouter.post("/google", googleSignIn);

export default authenticationRouter;