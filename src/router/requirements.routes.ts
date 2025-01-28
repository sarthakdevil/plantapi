import { Router } from "express";
import jwthelper from "../middleware/jwt.middleware";
import RequirementsController from "../controllers/requirements.controller";
const requirementrouter = Router();

requirementrouter.post("/requirements", jwthelper.verifyToken, RequirementsController.create);

requirementrouter.get("/requirements", jwthelper.verifyToken, RequirementsController.listrequirements);

export default requirementrouter;