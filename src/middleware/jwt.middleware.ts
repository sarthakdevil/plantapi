import { NextFunction,Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AuthPayload } from '../types';

export default class jwthelper{
    static async generateToken(payload: object){
        return jwt.sign(payload,process.env.JWT_SECRET, {expiresIn: '330y'});
    }
    static async verifyToken(req:Request, res:Response, next:NextFunction){
        const token = req.headers.authorization?.replace("Bearer ","");
        if(!token){
            res.status(400).send('Token is not provided');
            return;
        }
        try{
            const decoded = await jwt.verify(token as string, process.env.JWT_SECRET) as AuthPayload
            req.user = decoded;
            next();
        }catch{
            res.status(400).send('Invalid Token');
            return;
        }
    }
}