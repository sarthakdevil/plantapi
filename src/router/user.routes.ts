import { Router } from "express";

import UserController from "../controllers/user.controller";
import jwthelper from "../middleware/jwt.middleware";

const userrouter = Router();

userrouter.post("/register",UserController.register)
userrouter.post("/login",UserController.login)
userrouter.get("/profile",jwthelper.verifyToken,UserController.profile)

export default userrouter;