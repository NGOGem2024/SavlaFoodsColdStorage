const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


// Corrected Route Definitions
router.get('/items', orderController.getItems);  // Remove /api prefix
router.post('/place_order', orderController.placeOrder);
router.post('/getItemsByLotNo', orderController.getItemsByLotNo);


module.exports = router;