// const oracledb = require("oracledb");
// const db = require("../config/database");
// const orderController = {
//   getItems: async (req, res) => {

//     let connection;
//     try {
//       connection = await db.getConnection();
//       console.log('Connection established successfully');

//       const query = `SELECT item_id, item_name, lot_no, item_marks, vakal_no, available_qty, unit_name FROM savla_items`;
//       console.log('Executing query:', query);

//       const result = await connection.execute(
//         query,
//         [],
//         { outFormat: oracledb.OUT_FORMAT_OBJECT }
//       );

//       console.log('Query executed successfully');
//       console.log('Total rows:', result.rows.length);
//       console.log('First few rows:', result.rows.slice(0, 5));

//       res.status(200).json({
//         success: true,
//         count: result.rows.length,
//         data: result.rows,
//       });
//     } catch (err) {
//       console.error("Detailed Error fetching items:", err);
//       res.status(500).json({
//         success: false,
//         error: "Failed to fetch items",
//         details: err.message,
//         stack: err.stack,
//       });
//     } finally {
//       if (connection) {
//         try {
//           await connection.close();
//           console.log('Connection closed successfully');
//         } catch (closeErr) {
//           console.error("Error closing connection:", closeErr);
//         }
//       }
//     }
//   },
//    // Place order
  
//    placeOrder: async (req, res) => {
//     let connection;
    
//     try {
//       // Log the entire request body for debugging
//       console.log('Received request body:', req.body);

//       // Flexible input handling
//       let items = req.body;
      
//       // If single item object is passed, convert it to an array
//       if (items && !Array.isArray(items)) {
//         // Check if the object has required properties
//         if (items.item_id && items.lot_no && items.quantity) {
//           items = [{
//             itemId: items.item_id,
//             lotNo: items.lot_no,
//             quantity: items.quantity
//           }];
//         } else {
//           console.log('Invalid item object:', items);
//           return res.status(400).json({
//             success: false,
//             message: 'Invalid order. Missing required item properties.',
//             receivedBody: items
//           });
//         }
//       }
      
//       // Check if items exist and is a non-empty array
//       if (!items || items.length === 0) {
//         console.log('No items found in request body');
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid order. No items provided.',
//           receivedBody: req.body
//         });
//       }

//       // Establish database connection
//       connection = await db.getConnection();

//       const orderDetails = [];

//       try {
//         // Start transaction using execute with a proper transaction command
//         // await connection.execute(`BEGIN TRANSACTION`);

//         // Process each item in the order
//         for (const item of items) {
//           // Comprehensive item validation
//           if (!item.itemId) {
//             throw new Error('Invalid item details: itemId is required');
//           }

//           if (!item.lotNo) {
//             throw new Error('Invalid item details: lotNo is required');
//           }

//           if (!item.quantity || item.quantity <= 0) {
//             throw new Error('Invalid item details: quantity must be a positive number');
//           }

//           // Check available quantity
//           const stockCheck = await connection.execute(
//             `SELECT AVAILABLE_QTY 
//              FROM itemstockdetails 
//              WHERE ITEM_ID = :itemId 
//              AND LOT_NO = :lotNo`,
//             {
//               itemId: item.itemId,
//               lotNo: item.lotNo
//             }
//           );

//           // Verify stock availability
//           if (stockCheck.rows.length === 0) {
//             throw new Error('Item or Lot not found');
//           }

//           const availableQty = stockCheck.rows[0][0];
          
//           if (availableQty < item.quantity) {
//             throw new Error('Insufficient quantity');
//           }

//           // Update stock quantity
//           const updateStock = await connection.execute(
//             `UPDATE itemstockdetails 
//              SET AVAILABLE_QTY = AVAILABLE_QTY - :quantity 
//              WHERE ITEM_ID = :itemId 
//              AND LOT_NO = :lotNo`,
//             {
//               quantity: item.quantity,
//               itemId: item.itemId,
//               lotNo: item.lotNo
//             }
//           );

//           // Insert order into savla_orders table instead of ORDER_DETAILS
//           const insertOrder = await connection.execute(
//             `INSERT INTO savla_orders (
//                order_id, 
//                item_id, 
//                lot_no, 
//                quantity, 
//                order_date
//              ) VALUES (
//                savla_orders_seq.NEXTVAL, 
//                :itemId, 
//                :lotNo, 
//                :quantity, 
//                SYSDATE
//              )`,
//             {
//               itemId: item.itemId,
//               lotNo: item.lotNo,
//               quantity: item.quantity
//             }
//           );

//           orderDetails.push({
//             itemId: item.itemId,
//             lotNo: item.lotNo,
//             quantity: item.quantity
//           });
//         }

//         // Commit transaction
//         // await connection.execute(`COMMIT`);

//         // Respond with success
//         res.status(201).json({
//           success: true,
//           message: 'Order placed successfully',
//           orderDetails: orderDetails
//         });

//       } catch (transactionError) {
//         // Rollback transaction
//         try {
//           await connection.execute(`ROLLBACK`);
//         } catch (rollbackError) {
//           console.error('Rollback error:', rollbackError);
//         }

//         // Throw the original error for main catch block
//         throw transactionError;
//       }

//     } catch (error) {
//       // Log and respond with error
//       console.error('Order placement error:', error);
//       res.status(500).json({
//         success: false,
//         message: 'Failed to place order',
//         error: error.message,
//         details: error.toString()
//       });

//     } finally {
//       // Close database connection
//       if (connection) {
//         try {
//           await connection.close();
//         } catch (closeError) {
//           console.error('Connection close error:', closeError);
//         }
//       }
//     }
//   },

//    getUserOrders: async (req, res) => {
//     let connection;
//     try {
//       connection = await db.getConnection();
//       console.log('Connection established successfully');

//       const query = `
//         SELECT 
//           so.order_id, 
//           so.item_id, 
//           si.item_name, 
//           so.lot_no, 
//           so.quantity, 
//           so.order_date,
//           si.unit_name
//         FROM 
//           savla_orders so
//         JOIN 
//           savla_items si ON so.item_id = si.item_id
//         ORDER BY 
//           so.order_date DESC
//       `;

//       const result = await connection.execute(
//         query,
//         [],
//         { outFormat: oracledb.OUT_FORMAT_OBJECT }
//       );

//       console.log('Orders fetched successfully');
//       console.log('Total orders:', result.rows.length);

//       res.status(200).json({
//         success: true,
//         count: result.rows.length,
//         data: result.rows,
//       });
//     } catch (err) {
//       console.error("Detailed Error fetching orders:", err);
//       res.status(500).json({
//         success: false,
//         error: "Failed to fetch orders",
//         details: err.message,
//         stack: err.stack,
//       });
//     } finally {
//       if (connection) {
//         try {
//           await connection.close();
//           console.log('Connection closed successfully');
//         } catch (closeErr) {
//           console.error("Error closing connection:", closeErr);
//         }
//       }
//     }
//   },

//   // Method to get available stock for a specific item
//   getItemStockDetails: async (req, res) => {
//     let connection;
//     const { itemId } = req.params;

//     try {
//       connection = await db.getConnection();
      
//       const query = `
//         SELECT 
//           LOT_NO, 
//           AVAILABLE_QTY 
//         FROM 
//           itemstockdetails 
//         WHERE 
//           ITEM_ID = :itemId AND AVAILABLE_QTY > 0
//       `;

//       const result = await connection.execute(
//         query,
//         { itemId },
//         { outFormat: oracledb.OUT_FORMAT_OBJECT }
//       );

//       res.status(200).json({
//         success: true,
//         stockDetails: result.rows,
//       });
//     } catch (err) {
//       console.error("Error fetching stock details:", err);
//       res.status(500).json({
//         success: false,
//         error: "Failed to fetch stock details",
//         details: err.message,
//       });
//     } finally {
//       if (connection) {
//         try {
//           await connection.close();
//         } catch (closeErr) {
//           console.error("Error closing connection:", closeErr);
//         }
//       }
//     }
//   }
// }



// module.exports = orderController;


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

          // Insert order into savla_orders table
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
        await connection.commit();

        // Respond with success
        res.status(201).json({
          success: true,
          message: 'Order placed successfully',
          orderDetails: orderDetails
        });

      } catch (transactionError) {
        // Rollback transaction
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error('Rollback error:', rollbackError);
        }

        // Log and respond with error details
        console.error('Transaction error:', transactionError);
        res.status(500).json({
          success: false,
          message: 'Failed to place order',
          error: transactionError.message,
          details: transactionError.toString()
        });
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
  },

  getItemsByLotNo: async (req, res) => {
    let connection;
  
    try {
      // Log request details for debugging
      console.log('Received request body:', req.body);
      console.log('Request Headers:', req.headers);
  
      // Extract lot numbers from request body
      let lotNos = req.body.lotNos;
  
      // Flexible input handling - convert single lot number to array
      if (lotNos && !Array.isArray(lotNos)) {
        if (typeof lotNos === 'string' || typeof lotNos === 'number') {
          lotNos = [lotNos];
        } else {
          return res.status(400).json({
            success: false,
            message: 'Invalid lot numbers format',
            receivedValue: lotNos
          });
        }
      }
  
      // Validate input
      if (!lotNos || lotNos.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid lot numbers provided',
          debugInfo: {
            lotNos: lotNos,
            isArray: Array.isArray(lotNos),
            length: lotNos ? lotNos.length : 'N/A'
          }
        });
      }
  
      // Establish database connection
      connection = await db.getConnection();
  
      // Generate placeholders for binding
      const placeholders = lotNos.map((_, index) => `:lot${index}`).join(',');
  
      // Updated query to join with itemstockdetails
      const query = `
        SELECT 
          i.ITEM_ID,
          i.ITEM_NAME,
          i.LOT_NO,
          i.ITEM_MARKS,
          i.VAKAL_NO,
          isd.AVAILABLE_QTY,
          i.UNIT_NAME
        FROM savla_items i
        INNER JOIN itemstockdetails isd 
          ON i.ITEM_ID = isd.ITEM_ID 
          AND i.LOT_NO = isd.LOT_NO
        WHERE i.LOT_NO IN (${placeholders})
      `;
  
      // Create bind variables
      const bindVars = lotNos.reduce((acc, lotNo, index) => {
        acc[`lot${index}`] = lotNo;
        return acc;
      }, {});
  
      // Execute query
      const result = await connection.execute(
        query,
        bindVars,
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
  
      // Check if any results were found
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No items found for the provided lot numbers',
          searchedLotNos: lotNos
        });
      }
  
      // Return successful response
      res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows
      });
  
    } catch (error) {
      // Log and handle errors
      console.error('Error fetching items by lot number:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch items',
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
};
module.exports = orderController;

