// //   const express = require('express');
// //   const authRoutes = require('./routes/auth');
// //   const db = require('./config/database');
// //   const cors = require('cors');
// //   const bodyParser = require('body-parser');
// //   //const dbConfig = require('./config/dbconfig');
// //   const routes = require('./routes/orderRoutes');
// //   const imageRoutes = require('./routes/imageRoutes');


// //   require('dotenv').config();
// //  app.use(express.json());
  
// //   app.use(cors());
// //   app.use('/sf', authRoutes);
// //   app.use('/api', imageRoutes);
// //   app.use('/api', routes);
// //   app.use(bodyParser.urlencoded({ extended: true }));
  
// //   const app = express();
// //   const PORT = process.env.PORT || 3000;

// //  db.initialize()
// //   .then(() => {
// //     app.listen(PORT, () => {
// //       console.log(`Server running on port ${PORT}`);
// //     });
// //   })
// //   .catch(err => {
// //     console.error('Failed to initialize database:', err);
// //   });

 

// //   process.on('SIGINT', async () => {
// //     try {
// //       await db.close();
// //       console.log('Database connection closed.');
// //       process.exit(0);
// //     } catch (err) {
// //       console.error('Error closing database connection:', err);
// //       process.exit(1);
// //     }
// //   });

// const express = require('express');
// const authRoutes = require('./routes/auth');
// const db = require('./config/database');
// const cors = require('cors');
// // const bodyParser = require('body-parser');
// // const dbConfig = require('./config/dbconfig');
// const routes = require('./routes/orderRoutes');
// const imageRoutes = require('./routes/imageRoutes');
// require('dotenv').config();

// const app = express();  // Initialize the app here
// const PORT = process.env.PORT || 3000;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true })); 
// app.use(cors());
// app.use('/sf', authRoutes);
// app.use('/api', imageRoutes);
// app.use('/api', routes);


// db.initialize()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch(err => {
//     console.error('Failed to initialize database:', err);
//   });

// process.on('SIGINT', async () => {
//   try {
//     await db.close();
//     console.log('Database connection closed.');
//     process.exit(0);
//   } catch (err) {
//     console.error('Error closing database connection:', err);
//     process.exit(1);
//   }
// });

// // Add this after your routes
// app.use((err, req, res, next) => {
//   console.error('Unhandled Error:', err);
  
//   if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
//     return res.status(400).json({
//       error: 'Invalid JSON',
//       message: 'The request body contains invalid JSON'
//     });
//   }
  
//   res.status(500).json({
//     error: 'Internal Server Error',
//     message: err.message
//   });
// });


const express = require('express');
const authRoutes = require('./routes/auth');
const db = require('./config/database');
const cors = require('cors');
const routes = require('./routes/orderRoutes');
const imageRoutes = require('./routes/imageRoutes');
require('dotenv').config();

const app = express();

// Simplified middleware
app.use(cors());

// Remove JSON parsing middleware for GET requests
app.use((req, res, next) => {
  if (req.method === 'GET') {
    return next(); // Skip body parsing for GET requests
  }
  express.json()(req, res, next);
});

app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// Routes
app.use('/sf', authRoutes);
app.use('/api', imageRoutes);
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Comprehensive Error Handler:');
  console.error('Error Name:', err.name);
  console.error('Error Message:', err.message);
  console.error('Full Error:', err);

  res.status(500).json({
    error: 'Unexpected Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

const PORT = process.env.PORT || 3000;

db.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
  });

process.on('SIGINT', async () => {
  try {
    await db.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error closing database connection:', err);
    process.exit(1);
  }
});