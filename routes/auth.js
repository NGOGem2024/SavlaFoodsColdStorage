const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');



// Protected routes
router.post('/getUserAccountID', authController.getUserAccountID);
router.post('/listAccounts', authMiddleware, authController.listAccounts);
router.post('/getItemCatSubCat', authMiddleware, authController.getItemCatSubCat);
router.post('/getItemsBySubCategory', authMiddleware, authController.getItemsBySubCategory);
router.post('/getItemDetailswithStock', authMiddleware, authController.getItemDetailsWithStock);
router.post('/getItemDetailsAndUpdateStock', authMiddleware, authController.getItemDetailsAndUpdateStock);
router.get('/getOrderHistory', authMiddleware, authController.getOrderHistory);
// router.get('/orders/:orderId', authMiddleware, authController.getItemDetailsAndUpdateStock);



module.exports = router;




 