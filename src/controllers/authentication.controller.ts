import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';

import helper from '../helpers';
import db from '../services';
import ErrorResponse from '../helpers/error.class';
import sendEmail from '../utils/mailer.util';

import { CreateUserInput, VerifyUserInput, forgotPasswordInput, resetPasswordInput } from '../schema/user.schema';

dotenv.config({ path: path.resolve(process.cwd(), 'src/.env') });

// @description     Register a user
// @route           POST /api/auth/register
// @access          Public
const register = async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists in our DB
        const userExists = await db.getUserByEmail(email);

        if (userExists) {
            return next(new ErrorResponse('User already exists', 400));
        }

        // Register and store the new user
        const salt: string = helper.random();
        const verificationCode: string = helper.getRandomUUID();

        const user = await db.createUser({
            name,
            email,
            salt,
            password: helper.authentication(salt, password),
            verificationCode
        });

        // Create email verification url
        const verifyUserURL: string = `${process.env.APP_BASE_URL}/api/auth/verify/${email}/${verificationCode}`;

        // User verification email template in HTML
        const HTML: string = `
            <p>Please go to this link to verify your email:</p>
            <a href=${verifyUserURL} clicktracking=off>${verifyUserURL}</a>
        `;

        // Send email
        await sendEmail({
            from: `Node-TypeScript-API <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Email Verification',
            text: `Hello,\n Welcome. Please click on the link to verify your account.\n${verifyUserURL}`,
            HTML,
        });

        return res.status(201).json({
            success: true,
            message: 'Email Verification link sent to your email'
        });
    } catch (error: unknown) {
        return next(error);
    }
};

// @description     Verify a user
// @route           GET /api/auth/verify/:id/:verificationCode
// @access          Public
const verifyUser = async (req: Request<VerifyUserInput>, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>> => {

    const { id, verificationCode } = req.params;
    
    try {
        // Check if user is registered and not verified
        const userExists = await db.getUnverifiedUserByEmail(id);

        // If user does not exists or verification codes are not same
        if (!userExists || userExists.verification_code !== verificationCode) {
            return next(new ErrorResponse('Invalid link', 400));
        }
        
        // Update user verification status
        await db.updateUserVerificationStatus(userExists.email, true);

        // Get the updated user details
        const updatedUser = await db.getUserByEmail(id);

        return res.status(200).json({
            success: true,
            ...updatedUser
        });

    } catch (error: unknown) {
        return next(error);
    }
};

// @description     Forgot password
// @route           POST /api/auth/forgotPassoword
// @access          Public
const forgotPassword = async (req: Request<{}, {}, forgotPasswordInput>, res: Response, next: NextFunction) => {
    const { email } = req.body;

    try {
        const user = await db.getVerifiedUserByEmail(email);

        // Check if user is not registered and verified
        if(!user) {
            return next( new ErrorResponse('Email could not be sent', 400));
        }

        // Generate a password reset code 
        const passwordResetCode: string = helper.getRandomUUID();

        // Update password reset code
        await db.updatePasswordResetCode(user.email, passwordResetCode);

        // Create forgot password url
        const resetPasswordURL: string = `${process.env.APP_BASE_URL}/api/auth/resetPassword/${passwordResetCode}`;

        // Forgot password email template in HTML
        const HTML: string = `
            <p>Please go to this link to reset your password:</p>
            <a href=${resetPasswordURL} clicktracking=off>${resetPasswordURL}</a>
        `;

        // Send email
        await sendEmail({
            from: `Node-TypeScript-API <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Forgot password',
            text: `Hello,\n Welcome. Please go to this link to reset your password.\n${resetPasswordURL}`,
            HTML,
        });

        return res.status(200).json({
            success: true,
            message: 'Reset password link sent to your email'
        });

    } catch (error: unknown) {
        return next(error);
    }
};

// @description     Forgot password
// @route           POST /api/auth/forgotPassoword
// @access          Public
const resetPassword = async (req: Request<resetPasswordInput['params'], {}, resetPasswordInput['body']>, res: Response, next: NextFunction) => {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;

    try {
        const user = await db.getUserByEmail(id);

        // Check if user is registered, having password reset code and it matches with code sent by the user
        if(!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
            return next( new ErrorResponse('Password could not be reset', 400));
        }

        // Update password reset code to null so it can't be used anymore
        db.updatePasswordResetCode(user.email, null);

        // Update user password
        const salt: string = helper.random();

        await db.updateUserPassword(user.email, helper.authentication(salt, password));

        return res.status(204).json({
            success: true,
            message: 'Password reset successful'
        });

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
        if (user.password !== expectedHash) {
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


export default { register, verifyUser, login, forgotPassword, resetPassword };