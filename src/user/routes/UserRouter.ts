import { Router } from 'express';
import { UserController }  from '../controller'

const router = Router();

router.post('/signup', UserController.signup)
router.post('/signin', UserController.signin)

export default router