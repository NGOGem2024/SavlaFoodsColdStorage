  const express = require('express');
  const authRoutes = require('./routes/auth');
  const db = require('./config/database');
  const cors = require('cors');


  require('dotenv').config();

  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use(cors());
  app.use('/sf', authRoutes);

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


//Integration
// const express = require('express');
// const cors = require('cors'); // npm install cors
// const authRoutes = require('./routes/auth');
// const db = require('./config/database');

// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors()); // Enable CORS for all routes
// app.use(express.json());

// app.use('/sf', authRoutes);

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
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const apiRoutes = require('./routes/auth');

// const app = express();

// // Enable CORS for all routes
// app.use(cors());

// // Parse JSON request body
// app.use(bodyParser.json());

// // Parse URL-encoded request body
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.json());

// app.use(cors());

// // Mount API routes
// app.use('/sf', apiRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something broke!');
// });

// app.use('*', (req, res) => {
//   console.log('Received request for:', req.originalUrl);
//   res.status(404).send('Route not found');
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });