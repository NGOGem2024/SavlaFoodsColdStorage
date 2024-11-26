const oracledb = require("oracledb");
const db = require("../config/database");
const orderController = {
  getItems: async (req, res) => {

    let connection;
    try {
      connection = await db.getConnection();
      console.log('Connection established successfully');

      const query = `SELECT item_id, item_name, lot_no, item_marks, vakal_no, available_qty, unit_name FROM savla_items`;
      console.log('Executing query:', query);

      const result = await connection.execute(
        query,
        [],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      console.log('Query executed successfully');
      console.log('Total rows:', result.rows.length);
      console.log('First few rows:', result.rows.slice(0, 5));

      res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows,
      });
    } catch (err) {
      console.error("Detailed Error fetching items:", err);
      res.status(500).json({
        success: false,
        error: "Failed to fetch items",
        details: err.message,
        stack: err.stack,
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
          console.log('Connection closed successfully');
        } catch (closeErr) {
          console.error("Error closing connection:", closeErr);
        }
      }
    }
  },
   // Place order
  
   placeOrder: async (req, res) => {
    let connection;
    
    try {
      // Log the entire request body for debugging
      console.log('Received request body:', req.body);

      // Flexible input handling
      let items = req.body;
      
      // If single item object is passed, convert it to an array
      if (items && !Array.isArray(items)) {
        // Check if the object has required properties
        if (items.item_id && items.lot_no && items.quantity) {
          items = [{
            itemId: items.item_id,
            lotNo: items.lot_no,
            quantity: items.quantity
          }];
        } else {
          console.log('Invalid item object:', items);
          return res.status(400).json({
            success: false,
            message: 'Invalid order. Missing required item properties.',
            receivedBody: items
          });
        }
      }
      
      // Check if items exist and is a non-empty array
      if (!items || items.length === 0) {
        console.log('No items found in request body');
        return res.status(400).json({
          success: false,
          message: 'Invalid order. No items provided.',
          receivedBody: req.body
        });
      }

      // Establish database connection
      connection = await db.getConnection();

      const orderDetails = [];

      try {
        // Start transaction using execute with a proper transaction command
        // await connection.execute(`BEGIN TRANSACTION`);

        // Process each item in the order
        for (const item of items) {
          // Comprehensive item validation
          if (!item.itemId) {
            throw new Error('Invalid item details: itemId is required');
          }

          if (!item.lotNo) {
            throw new Error('Invalid item details: lotNo is required');
          }

          if (!item.quantity || item.quantity <= 0) {
            throw new Error('Invalid item details: quantity must be a positive number');
          }

          // Check available quantity
          const stockCheck = await connection.execute(
            `SELECT AVAILABLE_QTY 
             FROM itemstockdetails 
             WHERE ITEM_ID = :itemId 
             AND LOT_NO = :lotNo`,
            {
              itemId: item.itemId,
              lotNo: item.lotNo
            }
          );

          // Verify stock availability
          if (stockCheck.rows.length === 0) {
            throw new Error('Item or Lot not found');
          }

          const availableQty = stockCheck.rows[0][0];
          
          if (availableQty < item.quantity) {
            throw new Error('Insufficient quantity');
          }

          // Update stock quantity
          const updateStock = await connection.execute(
            `UPDATE itemstockdetails 
             SET AVAILABLE_QTY = AVAILABLE_QTY - :quantity 
             WHERE ITEM_ID = :itemId 
             AND LOT_NO = :lotNo`,
            {
              quantity: item.quantity,
              itemId: item.itemId,
              lotNo: item.lotNo
            }
          );

          // Insert order into savla_orders table instead of ORDER_DETAILS
          const insertOrder = await connection.execute(
            `INSERT INTO savla_orders (
               order_id, 
               item_id, 
               lot_no, 
               quantity, 
               order_date
             ) VALUES (
               savla_orders_seq.NEXTVAL, 
               :itemId, 
               :lotNo, 
               :quantity, 
               SYSDATE
             )`,
            {
              itemId: item.itemId,
              lotNo: item.lotNo,
              quantity: item.quantity
            }
          );

          orderDetails.push({
            itemId: item.itemId,
            lotNo: item.lotNo,
            quantity: item.quantity
          });
        }

        // Commit transaction
        // await connection.execute(`COMMIT`);

        // Respond with success
        res.status(201).json({
          success: true,
          message: 'Order placed successfully',
          orderDetails: orderDetails
        });

      } catch (transactionError) {
        // Rollback transaction
        try {
          await connection.execute(`ROLLBACK`);
        } catch (rollbackError) {
          console.error('Rollback error:', rollbackError);
        }

        // Throw the original error for main catch block
        throw transactionError;
      }

    } catch (error) {
      // Log and respond with error
      console.error('Order placement error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to place order',
        error: error.message,
        details: error.toString()
      });

    } finally {
      // Close database connection
      if (connection) {
        try {
          await connection.close();
        } catch (closeError) {
          console.error('Connection close error:', closeError);
        }
      }
    }
  }
}


module.exports = orderController;
