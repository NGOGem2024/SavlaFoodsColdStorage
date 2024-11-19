const oracledb = require('oracledb');
require('dotenv').config();

// Validate environment variables
const validateConfig = () => {
  const requiredEnvVars = ['DB_USER', 'DB_PASSWORD', 'DB_CONNECTION_STRING'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING,
  poolMin: 2,
  poolMax: 10,
  poolIncrement: 2
};

let pool;

async function initialize() {
  try {
    validateConfig();
    console.log('Attempting to create connection pool...');
    console.log(`Connection string: ${dbConfig.connectString}`);
    
    pool = await oracledb.createPool(dbConfig);
    console.log('Connection pool created successfully');
  } catch (err) {
    console.error('Failed to create connection pool:', err);
    throw err;
  }
}

async function close() {
  try {
    if (pool) {
      await pool.close(0);
      console.log('Connection pool closed');
    }
  } catch (err) {
    console.error('Error closing connection pool:', err);
    throw err;
  }
}

async function execute(sql, binds = {}, options = {}) {
  let connection;
  try {
    if (!pool) {
      throw new Error('Database pool not initialized');
    }
    
    connection = await pool.getConnection();
    return await connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...options
    });
  } catch (err) {
    console.error('Error executing SQL:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

// Export oracledb along with other functions
module.exports = { initialize, close, execute, validateConfig, oracledb };