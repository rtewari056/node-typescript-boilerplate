import express, { Router } from 'express';

import authentication from './authentication.route.js'
import user from './user.route.js'

const router: Router = express.Router();

router.use(authentication);
router.use(user);

export default router;