import express, { Router } from 'express';
import authentication from '../controllers/authentication.controller';

import validateResource from '../middlewares/validateResource.middleware';
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from '../schema/user.schema';
import { createSessionSchema } from '../schema/auth.schema';

const router: Router = express.Router();

router.route('/auth/register').post(validateResource(createUserSchema), authentication.register);
router.route('/auth/verify/:id/:verificationCode').get(validateResource(verifyUserSchema), authentication.verifyUser);
router.route('/auth/login').post(validateResource(createSessionSchema), authentication.login);
router.route('/auth/forgotPassword').post(validateResource(forgotPasswordSchema), authentication.forgotPassword);
router.route('/auth/resetPassword/:id/:passwordResetCode').post(validateResource(resetPasswordSchema), authentication.resetPassword);

export default router;