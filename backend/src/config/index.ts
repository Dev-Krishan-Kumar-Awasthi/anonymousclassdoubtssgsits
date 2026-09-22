import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'sgsits_anonymous_super_secure_jwt_secret_indore_2026',
  timezone: process.env.TIMEZONE || 'Asia/Kolkata',
};
