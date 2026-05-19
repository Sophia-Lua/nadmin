export const jwtConfig = () => ({
  secret: process.env.JWT_SECRET || 'default-secret-key',
  expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '7200', 10),
});
