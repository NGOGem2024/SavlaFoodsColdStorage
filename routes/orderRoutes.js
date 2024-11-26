const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Corrected Route Definitions
router.get('/items', orderController.getItems);  // Remove /api prefix
router.post('/place-order', orderController.placeOrder);
//     try {
//       const orderController = new OrderController();
//       await orderController.placeOrder(req, res);
//     } catch (error) {
//       console.error('Route error:', error);
//       res.status(500).json({
//         message: 'Internal server error',
//         error: error.message
//       });
//     }
//   });
// router.get('/orders/:orderId', orderController.getOrderDetails);

module.exports = router;