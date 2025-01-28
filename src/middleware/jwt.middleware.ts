import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
export default class jwthelper{
    static async generateToken(payload:any){
        return jwt.sign(payload,process.env.JWT_SECRET, {expiresIn: '1d'});
    }
    static async verifyToken(req:Request, res:Response, next:NextFunction){
        const token = req.headers['x-access-token'];
        if(!token){
            res.status(400).send('Token is not provided');
            return;
        }
        try{
            const decoded = await jwt.verify(token as string, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        }catch(error){
            res.status(400).send('Invalid Token');
            return;
        }
    }
}