import express, { Router } from 'express';
import authentication from '../controllers/authentication.controller';

import validateResource from '../middlewares/validateResource.middleware';
import { createUserSchema, verifyUserSchema } from '../schema/user.schema';

const router: Router = express.Router();

router.route('/auth/register').post(validateResource(createUserSchema), authentication.register);
router.route('/auth/verify/:id/:verificationCode').get(validateResource(verifyUserSchema), authentication.verifyUser);
router.route('/auth/login').post(authentication.login);

export default router;