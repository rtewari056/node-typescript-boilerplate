import express, { Router } from 'express';
import { register } from '../controllers/authentication.controllers.js';


const router: Router = express.Router();

router.route('/auth/register').post(register);

export default router;