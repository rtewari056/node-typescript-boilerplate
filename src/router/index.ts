import express, { Router } from 'express';

import authentication from './authentication.route.js'

const router: Router = express.Router();

router.use(authentication);

export default router;