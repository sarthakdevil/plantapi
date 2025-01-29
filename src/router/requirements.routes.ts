import { Router } from "express";

import RequirementsController from "../controllers/requirements.controller";
import jwthelper from "../middleware/jwt.middleware";

const requirementrouter = Router();

requirementrouter.post("/requirements", jwthelper.verifyToken, RequirementsController.create);

requirementrouter.get("/requirements", jwthelper.verifyToken, RequirementsController.listrequirements);

export default requirementrouter;