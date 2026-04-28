module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'elearning_jwt_secret_key_2024',
    expire: process.env.JWT_EXPIRE || '7d'
  }
};