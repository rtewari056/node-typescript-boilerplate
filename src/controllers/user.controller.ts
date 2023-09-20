import { NextFunction, Request, Response } from "express";
import db from "../services";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'src/.env') });

// @description     Get all users
// @route           POST /api/getUsers
// @access          Public
const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {

    try {
        // Get all users from our DB
        const users = await db.getUsers();

        return res.status(200).json(users);
    } catch (error: unknown) {
        return next(error);
    }
};

export default { getAllUsers };