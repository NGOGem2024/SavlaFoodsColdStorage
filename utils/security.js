const crypto = require('crypto');
const bcrypt = require('bcrypt');

const security = {
  hashPassword: async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  },
  
  comparePassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  },
  
  generateSecureToken: () => {
    return crypto.randomBytes(32).toString('hex');
  }
};

module.exports = security;