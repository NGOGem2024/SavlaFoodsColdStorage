// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');


// router.post('/getUserAccountID', authController.getUserAccountID);
// router.get('/getItemCatSubCat/:CustomerID', authController.getItemCatSubCat);
// router.get('/getItemsBySubCategory/:SubCategoryID', authController.getItemsBySubCategory);
// router.get('/getItemDetailswithStock/:ItemID', authController.getItemDetailsWithStock);

// module.exports = router;    


const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public route
router.post('/getUserAccountID', authController.getUserAccountID);

// Protected routes
router.post('/getItemCatSubCat', authMiddleware, authController.getItemCatSubCat);
router.post('/getItemsBySubCategory', authMiddleware, authController.getItemsBySubCategory);
router.post('/getItemDetailswithStock', authMiddleware, authController.getItemDetailsWithStock);

module.exports = router;

// //Integration
// // const express = require('express');
// // const router = express.Router();
// // const authController = require('../controllers/authController');

// // router.post('/getUserAccountID', authController.getUserAccountID);

// // module.exports = router;
// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController'); // Make sure filename matches
// const authMiddleware = require('../middleware/auth');
// const oracledb = require('oracledb');
// const path = require('path');
// const fs = require('fs').promises;

 

// // Log the controller to debug
// console.log('Auth Controller:', authController);

// // Public route
// router.post('/getUserAccountID', authController.getUserAccountID);

// // Protected routes

// router.post('/getItemCatSubCat', authMiddleware,authController.getItemCatSubCat);
// // router.post('/getItemCatSubCat', authController.getItemCatSubCat);
// router.get('/image/:imageName', authMiddleware,authController.serveImage);
// router.post('/getItemsBySubCategory', authMiddleware, authController.getItemsBySubCategory);
// router.post('/getItemDetailswithStock', authMiddleware, authController.getItemDetailsWithStock);

// module.exports = router;

