import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

const prisma = new PrismaClient();

// Zod Schema for Validation
export const RequirementSchema = z.object({
  plantId: z.string().uuid(), // Ensures a valid UUID for the plantId
  name: z.string().min(1, "Name is required"), // Name must not be empty
  description: z.string().optional(), // Optional description
  value: z.number().positive("Value must be positive"), // Value must be positive
  unit: z.string().min(1, "Unit is required"), // Unit must not be empty
  type: z.string().min(1, "Type is required"), // Type must not be empty
  received: z.number().nonnegative().optional(), // Received defaults to 0 if not provided
});

export default class RequirementsController {
  static async create(req: Request, res: Response) {
    try {
      // Validate the request body
      const { name, description, value, unit, type, plantId, received } = RequirementSchema.parse(req.body);

      // Extract user ID from the request (assuming `req.user` is populated by middleware)
      const userId = req.user?.id; // Ensure middleware adds `user` to req

      if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
      }

      // Create a new requirement
      const requirement = await prisma.requirement.create({
        data: {
          name,
          description,
          value,
          unit,
          type,
          received: received ?? 0, // Use 0 as default if received is not provided
          plant: { connect: { id: plantId } }, // Connect to the related Plant
        },
      });

      // Respond with success
        res.status(201).json({
        message: "Requirement created successfully",
        data: requirement,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
            res.status(400).json({
          message: "Validation failed",
          errors: error.errors,
        });
        return;
      }

      console.error("Error creating requirement:", error);

      // Handle unexpected errors
            res.status(500).json({
        message: "An error occurred while creating the requirement",
      });
      return;
    }
  }
  static async listrequirements(req: Request, res: Response) {
    try {
      // Extract user ID from the request (assuming `req.user` is populated by middleware)
      const userId = req.user?.id; // Ensure middleware adds `user` to req

      if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
      }

      // Fetch all requirements for the user
      const requirements = await prisma.requirement.findMany({
        where: {
          plant: { user: { id: userId } },
        },
      });

      // Respond with the requirements
        res.status(200).json({
        message: "Requirements fetched successfully",
        data: requirements,
      });
      return;
    } catch (error) {
      console.error("Error fetching requirements:", error);

      // Handle unexpected errors
        res.status(500).json({
        message: "An error occurred while fetching requirements",
      });
      return;
    }
  }
}
