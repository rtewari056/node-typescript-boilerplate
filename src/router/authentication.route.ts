import express, { Router } from 'express';
import authentication from '../controllers/authentication.controller.js';

const router: Router = express.Router();

router.route('/auth/register').post(authentication.register);
router.route('/auth/login').post(authentication.login);

export default router;