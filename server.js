  const express = require('express');
  const authRoutes = require('./routes/auth');
  const db = require('./config/database');
  const cors = require('cors');
  //const dbConfig = require('./config/dbconfig');

  const imageRoutes = require('./routes/imageRoutes');


  require('dotenv').config();
  // app.use('/', imageRoutes);
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use(cors());
  app.use('/sf', authRoutes);
  app.use('/api', imageRoutes);
  // app.use('/', imageRoutes);

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

