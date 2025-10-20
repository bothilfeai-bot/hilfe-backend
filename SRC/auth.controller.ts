import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SupabaseService } from './services/supabase.service';
import { EmailService } from './services/email.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, full_name } = req.body;

      if (!email || !full_name) {
        return res.status(400).json({ error: 'Email et nom requis' });
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await SupabaseService.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà' });
      }

      // Créer l'utilisateur avec statut "pending"
      const user = await SupabaseService.createUser({
        email,
        full_name,
        password_hash: null,
        role: 'user',
        status: 'pending'
      });

      res.status(201).json({
        message: 'Inscription réussie. En attente de validation administrateur.',
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          status: user.status
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Erreur lors de l\\'inscription' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email et mot de passe requis' });
      }

      const user = await SupabaseService.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé' });
      }

      if (user.status !== 'approved') {
        return res.status(403).json({ error: 'Compte en attente d\\'approbation' });
      }

      if (!user.password_hash) {
        return res.status(401).json({ error: 'Mot de passe non configuré' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Mot de passe incorrect' });
      }

      // Générer le token JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Connexion réussie',
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          status: user.status
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      // Cette fonction sera complétée plus tard avec le middleware
      res.json({ message: 'Profile endpoint - à compléter' });
    } catch (error) {
      console.error('Get me error:', error);
      res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
    }
  }
}
