import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();

// Routes d'authentification
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', AuthController.getMe);

export const authRoutes = router;
