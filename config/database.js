const oracledb = require('oracledb');
require('dotenv').config();


const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTION_STRING
};

async function initialize() {
  await oracledb.createPool(dbConfig);
}

async function close() {
  await oracledb.getPool().close();
}

async function execute(sql, binds = [], opts = {}) {
  let connection;
  try {
    connection = await oracledb.getConnection();
    return await connection.execute(sql, binds, opts);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

module.exports = { initialize, close, execute };


//Integration
// const oracledb = require('oracledb');

// let pool;

// async function initialize() {
//   try {
//     pool = await oracledb.createPool({
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       connectString: process.env.DB_CONNECTION_STRING,
//     });
//     console.log('Connection pool created');
//   } catch (err) {
//     console.error('Error creating connection pool:', err);
//     throw err;
//   }
// }

// async function close() {
//   try {
//     await pool.close();
//     console.log('Connection pool closed');
//   } catch (err) {
//     console.error('Error closing connection pool:', err);
//     throw err;
//   }
// }

// async function execute(sql, binds = {}, options = {}) {
//   let connection;
//   try {
//     connection = await pool.getConnection();
//     return await connection.execute(sql, binds, options);
//   } catch (err) {
//     console.error('Error executing SQL:', err);
//     throw err;
//   } finally {
//     if (connection) {
//       try {
//         await connection.close();
//       } catch (err) {
//         console.error('Error closing connection:', err);
//       }
//     }
//   }
// }

// module.exports = {
//   initialize,
//   close,
//   execute
// };