import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import db from "../services";
import ErrorResponse from '../helpers/error.class';

dotenv.config({ path: path.resolve(process.cwd(), 'src/.env') });

const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const sessionToken: string = req.cookies[process.env.COOOKIE_NAME || 'Node-TypeScript-AUTH'];

        if (!sessionToken) {
            return next(new ErrorResponse('Not authorized to access this route', 401));
        }

        const existingUser = await db.getUserBySessionToken(sessionToken);

        if (!existingUser) {
            return next(new ErrorResponse('No user found', 404));
        }

        // req.body.existingUser = existingUser;
        next();

    } catch (error: unknown) {
        return next(error);
    }
};

export default { isAuthenticated }