// src/types/express/index.d.ts
import { JwtPayload } from "jsonwebtoken";

export type AuthPayload =  JwtPayload & {
  id:string;
  email:string;
  createdAt:string;
};

declare global {
  namespace Express {
    interface Request {
      user?:  AuthPayload// Replace `any` with the appropriate type for `user`
    }
  }
}
