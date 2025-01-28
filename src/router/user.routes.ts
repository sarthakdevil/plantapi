import { Router } from "express";
import UserController from "../controllers/user.controller";
import jwthelper from "../middleware/jwt.middleware";
const userrouter = Router();

userrouter.get("/register",UserController.register)
userrouter.get("/login",UserController.login)
userrouter.get("/profile",UserController.profile)


export default userrouter;