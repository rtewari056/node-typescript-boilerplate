import express, { NextFunction, Request, Response } from "express";
import { ErrorResponse, authentication, random } from "../helpers/index.js";
import { createUser, getUserByEmail } from "../services/index.js";

// @description     Register a user
// @route           POST /api/auth/register
// @access          Public
const register = async (req: Request, res: Response, next: NextFunction) => {
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
        const userExists = await getUserByEmail(email);

        if (userExists) {
            return next(new ErrorResponse('User already exists', 400));
        }

        // Register and store the new user
        const user = await createUser({
            name,
            email,
            password: authentication(random(), password)
        })

        return res.status(201).json(user);
    } catch (error: unknown) {
        return next(error);
    }
};


export { register };