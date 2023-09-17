import { NextFunction, Request, Response } from "express";
import helper from "../helpers/index.js";
import db from "../services/index.js";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'src/.env') });

// @description     Get all users
// @route           POST /api/getUsers
// @access          Public
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {

    try {
        console.log(req.body);
        
        // Get all users from our DB
        const users = await db.getUsers();

        return res.status(200).json(users);
    } catch (error: unknown) {
        return next(error);
    }
};

export default { getAllUsers };