import { NextFunction, Request, Response } from "express";
import helper from "../helpers/index.js";
import db from "../services/index.js";
import dotenv from 'dotenv';
import path from 'path';
import ErrorResponse from "../helpers/error.class.js";

dotenv.config({ path: path.resolve(process.cwd(), 'src/.env') });

// @description     Register a user
// @route           POST /api/auth/register
// @access          Public
const register = async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
    type reqBody = { name: string, email: string, password: string };

    try {
        const { name, email, password }: reqBody = req.body;

        // Check if any of them is undefined
        if (!name || !email || !password) {
            return next(
                new ErrorResponse('Please provide name, email and password', 400)
            );
        }

        // Check if user already exists in our DB
        const userExists = await db.getUserByEmail(email);

        if (userExists) {
            return next(new ErrorResponse('User already exists', 400));
        }

        // Register and store the new user
        const salt: string = helper.random();
        const user = await db.createUser({
            name,
            email,
            salt,
            password: helper.authentication(salt, password),
        })

        return res.status(201).json(user);
    } catch (error: unknown) {
        return next(error);
    }
};

// @description     Login a user
// @route           POST /api/auth/login
// @access          Public
const login = async (req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
    type reqBody = { name: string, email: string, password: string };

    try {
        const { email, password }: reqBody = req.body;

        // Check if any of them is undefined
        if (!email || !password) {
            return next(
                new ErrorResponse('Please provide email and password', 400)
            );
        }

        // Check if user already exists in our DB
        const user = await db.getUserByEmail(email);

        if (!user) {
            return next(new ErrorResponse('Invalid credentials', 400));
        }

        const expectedHash: string = helper.authentication(user.salt, password); // Create hashed password using saved salt and password of user

        // If expected hashed password and saved hashed password not matches
        if(user.password !== expectedHash) {
            return next(new ErrorResponse('Invalid credentials', 403));
        }

        const sessionToken: string = helper.authentication(helper.random(), email); // Generate session token

        // Save session token in database
        await db.updateSessionToken(email, sessionToken);

        const updatedUser = await db.getUserByEmail(email);

        res.cookie(process.env.COOOKIE_NAME || 'Node-TypeScript-AUTH', sessionToken, { domain: 'localhost' });

        return res.status(200).json(updatedUser);
    } catch (error: unknown) {
        return next(error);
    }
};


export default { register, login };