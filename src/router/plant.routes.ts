import { Router } from "express";
import PlantsController from "../controllers/plants.controller";
import jwthelper from "../middleware/jwt.middleware";

const router = Router();

// Create a new plant
router.post("/plants", jwthelper.verifyToken, PlantsController.create);

// Get all plants for the authenticated user
router.get("/plants", jwthelper.verifyToken, PlantsController.list);

// Get a single plant by ID
router.get("/plants/:id", jwthelper.verifyToken, PlantsController.get);

// Update a plant by ID
router.put("/plants/:id", jwthelper.verifyToken, PlantsController.update);

// Delete a plant by ID
router.delete("/plants/:id", jwthelper.verifyToken, PlantsController.deletePlant);

// Search plants by query (name, description, type, or origin)
router.get("/plants/search", jwthelper.verifyToken, PlantsController.search);

// Get all unique plant types
router.get("/plants/types", jwthelper.verifyToken, PlantsController.types);

// Get all unique plant names
router.get("/plants/names", jwthelper.verifyToken, PlantsController.names);

export default router;
