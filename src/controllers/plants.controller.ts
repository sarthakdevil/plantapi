import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

const  prisma = new PrismaClient();
const PlantSchema = z.object({
    name: z.string().min(3).optional(),
    description: z.string().min(10).optional(),
    imageUrl: z.string().url().optional(),
    species: z.string().min(3).optional(),
    nickname: z.string().min(3).optional(),
    origin : z.string().min(3).optional(),
});

export default class PlantsController {
    static async create(req: Request, res: Response) {
        try {
        // Validate input using zod
        const { name, description, imageUrl,species,origin,nickname} = PlantSchema.parse(req.body);
        if(!name || !species){
                res.status(400).json({
                error: "Bad Request",
                message: "All fields are required",
              });
              return;
        }
        const user = req.user!.id;
        const plant = await prisma.plant.create({
            data: {
            name,
            species,
            nickname,
            description,
            image: imageUrl,
            origin,
            user: { connect: { id: user }
            },
            },
        });
        res.status(201).json(plant);
        } catch (error) {
        if (error instanceof z.ZodError) {
            // Handle validation errors
            res.status(400).json({
            error: "Validation Error",
            details: error.errors,
            });
            return;
        }
        res.status(500).json({
            error: "Internal Server Error",
            message: error instanceof Error ? error.message : "Something went wrong",
        });
        }
    }
    static async list(req: Request, res: Response) {
        try {
            const user = req.user!.id;
        const plants = await prisma.plant.findMany({
            where: {
                user: { id: user }
            },
            include: {
                requirements: true,
            },
        }
        );
        res.status(200).json({
            success: true,
            plants
          });
        } catch (error) {
        res.status(500).json({
            error: "Internal Server Error",
            message: error instanceof Error ? error.message : "Something went wrong",
        });
        }
    }
    static async get(req: Request, res: Response) {
        try {
        const { id } = req.params;
        const user = req.user!.id;
        const plant = await prisma.plant.findUnique({
            where: { id: id,
                user: { id: user }
             },
        });
        if (!plant) {
            res.status(404).json({
            error: "Not Found",
            message: "Plant not found",
            });
            return;
        }
        res.status(200).json(plant);
        } catch (error) {
        res.status(500).json({
            error: "Internal Server Error",
            message: error instanceof Error ? error.message : "Something went wrong",
        });
        }
    }
    static async update(req: Request, res: Response) {
        try {
        const { id } = req.params;
        const { name, description, imageUrl } = PlantSchema.parse(req.body);
        const plant = await prisma.plant.update({
            where: { id:id },
            data: {
            name,
            description,
            image: imageUrl,
            },
        });
        res.status(200).json(plant);
        } catch (error) {
        if (error instanceof z.ZodError) {
            // Handle validation errors
            res.status(400).json({
            error: "Validation Error",
            details: error.errors,
            });
            return;
        }
    }
}
    static deletePlant = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const plant = await prisma.plant.delete({
            where: { id },
        });
        res.status(200).json(plant);
    } catch (error) {
        res.status(500).json({
            error: "Internal Server Error",
            message: error instanceof Error ? error.message : "Something went wrong",
        });

    }
}
    static async search(req: Request, res: Response) {
    try {
        const { query } = req.query;
        const user = req.user!.id;
        const plants = await prisma.plant.findMany({
            where: {
            OR: [
                { name: { contains: query as string }, user: { id: user } },
                { description: { contains: query as string }, user: { id: user } },
                { species: { contains: query as string }, user: { id: user } },
                { origin: { contains: query as string }, user: { id: user } },
            ],
            },
        });
        res.status(200).json({
            success: true,
            plants
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal Server Error",
            message: error instanceof Error ? error.message : "Something went wrong",
        });
    }
}
static async types(req: Request, res: Response) {
    try {
        const user = req.user!.id;
        const plants = await prisma.plant.findMany({
            where: {
                user: { id: user }
            },
            select: {
                species: true,
            },
        });

        // Extract unique plant types
        const types = Array.from(new Set(plants.map((plant) => plant.species)));

        // Respond with success and the unique types
        res.status(200).json({
            success: true,
            types,
        });
    } catch (error) {
        // Handle server errors
        res.status(500).json({
            error: "Internal Server Error",
            message: error instanceof Error ? error.message : "Something went wrong",
        });
    }
}
    static async names(req: Request, res: Response) {
    try {
        const user = req.user!.id;
        const plants = await prisma.plant.findMany({
            where: {
                user: { id: user }
            },
            select: {
                name: true,
            },
        });

        // Extract unique plant names
        const names = Array.from(new Set(plants.map((plant) => plant.name)));

        // Respond with success and the unique names
        res.status(200).json({
            success: true,
            names,
        });
    } catch (error) {
        // Handle server errors
        res.status(500).json({
            error: "Internal Server Error",
            message: error instanceof Error ? error.message : "Something went wrong",
        });
    }
}
}