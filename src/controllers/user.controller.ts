import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwthelper from "../middleware/jwt.middleware";
const prisma = new PrismaClient();

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default class UserController {
  static async register(req: Request, res: Response) {
    try {
      // Validate input using zod
      const { email, password } = UserSchema.parse(req.body);
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        res.status(400).json({
          error: "Bad Request",
          message: "User with this email already exists",
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user to the database
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
      const token = jwthelper.generateToken({ email: user.email, id: user.id });
      // Respond with the created user (excluding sensitive data)
      res.status(201).json({
        id: user.id,
        email: user.email,
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        res.status(400).json({
          error: "Validation Error",
          details: error.errors,
        });
      }
      res.status(500).json({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }
  static async login(req: Request, res: Response) {
    try {
      // Validate input using zod
      const { email, password } = UserSchema.parse(req.body);
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        res.status(404).json({
          error: "Not Found",
          message: "User with this email does not exist",
        });
        return;
      }

      // Compare the password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(401).json({
          error: "Unauthorized",
          message: "Invalid password",
        });
      }
      const token = jwthelper.generateToken({ email: user.email, id: user.id });
      // Respond with the user (excluding sensitive data)
      res.json({
        id: user.id,
        email: user.email,
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        res.status(400).json({
          error: "Validation Error",
          details: error.errors,
        });
      }
      res.status(500).json({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }
  static async profile(req: Request, res: Response) {
    try {
      // Get user from the request object
      const user = req.user;

      // Respond with the user (excluding sensitive data)
      res.json({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      });
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  }
}
