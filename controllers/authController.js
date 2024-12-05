
// //finalfinal

const jwt = require('jsonwebtoken');
const oracledb = require('oracledb');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';

const authController = {
// getUserAccountID with customer group information
async getUserAccountID (req, res) {
  const { sf_userName, sf_userPwd } = req.body;
  
  if (!sf_userName || !sf_userPwd) {
    return res.status(400).json({ 
      message: 'Username and password are required',
      debug: { provided: { username: !!sf_userName, password: !!sf_userPwd }}
    });
  }
  
  try {
    // const userCheck = await db.execute(
      // `SELECT DISTINCT
      //   CL.FK_CUSTOMER_ID, 
      //   CL.MOBILE_NO, 
      //   CL.PASSWORD, 
      //   CL.FK_CUST_GROUP_ID,
      //   C.DISP_NAME,
      //   C.CUSTOMER_NAME -- Ensure CUSTOMER_NAME is correct column name
      //  FROM CUSTOMER_LOGIN CL
      //  JOIN CUSTOMER C ON CL.FK_CUSTOMER_ID = C.CUSTOMER_ID
      //  WHERE UPPER(CL.USERNAME) = UPPER(:sf_userName)`
      const userCheck = await db.execute(
        `SELECT 
          FK_CUSTOMER_ID,
          MOBILE_NO,
          USER_PASSWORD,
          USER_NAME,
          FK_CUST_GROUP_ID,
          DISP_NAME
        FROM CUSTOMER_LOGIN1 
        WHERE UPPER(USER_NAME) = UPPER(:sf_userName) 
        AND USER_PASSWORD = :sf_userPwd`,
        {
          sf_userName: sf_userName.trim(),
          sf_userPwd: sf_userPwd
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

    if (!userCheck.rows || userCheck.rows.length === 0) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        debug: 'Username not found'
      });
    }

    const user = userCheck.rows[0];
    if (user.USER_PASSWORD !== sf_userPwd) {
      return res.status(401).json({
        message: 'Invalid credentials',
        debug: 'Password mismatch'
      });
    }

    const token = jwt.sign(
      { 
        customerId: user.FK_CUSTOMER_ID,
        username: sf_userName,
        displayName: user.DISP_NAME,
        customerGroupId: user.FK_CUST_GROUP_ID
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      input: { sf_userName },
      output: {
        CustomerID: user.FK_CUSTOMER_ID,
        PhoneNo: user.MOBILE_NO,
        DisplayName: user.DISP_NAME,
        CustomerGroupID: user.FK_CUST_GROUP_ID,
        CustomerName: user.CUSTOMER_NAME, // Ensure this column exists in the 'CUSTOMER' table
        token: token
      }
    });
    
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ 
      message: 'Server error',
      debug: error.message
    });
  }
},

// async listAccounts(req, res) {
//   const { FK_CUST_GROUP_ID } = req.body;

//   // Ensure FK_CUST_GROUP_ID is provided
//   if (!FK_CUST_GROUP_ID) {
//     return res.status(400).json({
//       message: 'Customer Group ID is required',
//       debug: { provided: { customerGroupId: !!FK_CUST_GROUP_ID }}
//     });
//   }

//   try {
//     // Query to fetch records based on FK_CUST_GROUP_ID
//     const query = await db.execute(
//       `SELECT DISTINCT 
//         cg.FK_CUSTOMER_ID,
//         cg.DISP_NAME,
//         cg.DEF,
//         cg.FK_CUST_GROUP_ID,
//         cg.CUSTOMER_NAME 
//        FROM CUST_GROUP cg
//        WHERE cg.FK_CUST_GROUP_ID = :FK_CUST_GROUP_ID
//        ORDER BY cg.DISP_NAME`,
//       { FK_CUST_GROUP_ID },  // Only passing FK_CUST_GROUP_ID
//       { outFormat: oracledb.OUT_FORMAT_OBJECT }
//     );

//     const groups = query.rows || [];

//     // Return the fetched data
//     res.json({
//       input: { FK_CUST_GROUP_ID },
//       output: {
//         count: groups.length,
//         groups: groups.map(row => ({
//           FK_CUSTOMER_ID: row.FK_CUSTOMER_ID,
//           DISP_NAME: row.DISP_NAME,
//           DEF: row.DEF,
//           FK_CUST_GROUP_ID: row.FK_CUST_GROUP_ID,
//           CUSTOMER_NAME: row.CUSTOMER_NAME
//         }))
//       }
//     });

//   } catch (error) {
//     console.error('Database error:', error);
//     res.status(500).json({
//       message: 'Server error',
//       debug: error.message
//     });
//   }
// },

// async listAccounts(req, res) {
//   const { FK_CUST_GROUP_ID } = req.body;

//   // Ensure FK_CUST_GROUP_ID is provided
//   if (!FK_CUST_GROUP_ID) {
//     return res.status(400).json({
//       message: 'Customer Group ID is required',
//       debug: { provided: { customerGroupId: !!FK_CUST_GROUP_ID }}
//     });
//   }

//   try {
//     // Updated query to fetch the required fields based on FK_CUST_GROUP_ID
//     const query = await db.execute(
//       // `
//       `SELECT DISTINCT 
//         a.FK_CUSTOMER_ID, 
//         c.NAME AS CUSTOMER_NAME, 
//         a.DISP_NAME,
//         a.FK_CUST_GROUP_ID,
//         CASE 
//           WHEN a.DISP_NAME = b.DISP_NAME THEN 1 
//           ELSE 0 
//         END AS DEF
//       FROM SYSTEM.CUSTOMER_LOGIN1 a
//       JOIN SYSTEM.CUSTOMER_LOGIN1 b 
//         ON a.FK_CUST_GROUP_ID = b.FK_CUST_GROUP_ID
//       JOIN SYSTEM.CUSTOMER_MASTER c
//         ON a.FK_CUSTOMER_ID = c.ID
//       WHERE b.USER_NAME = :username 
//         AND b.USER_PASSWORD = :password
//       ORDER BY a.DISP_NAME`,
//       { FK_CUST_GROUP_ID },  // Only passing FK_CUST_GROUP_ID
//       { outFormat: oracledb.OUT_FORMAT_OBJECT }
//     );

//     const groups = query.rows || [];

//     // Return the fetched data
//     res.json({
//       input: { FK_CUST_GROUP_ID },
//       output: {
//         count: groups.length,
//         groups: groups.map(row => ({
//           FK_CUSTOMER_ID: row.FK_CUSTOMER_ID,
//           DISP_NAME: row.DISP_NAME,
//           DEF: row.DEF,
//           FK_CUST_GROUP_ID: row.FK_CUST_GROUP_ID,
//           CUSTOMER_NAME: row.CUSTOMER_NAME
//         }))
//       }
//     });

//   } catch (error) {
//     console.error('Database error:', error);
//     res.status(500).json({
//       message: 'Server error',
//       debug: error.message
//     });
//   }
// },

// async listAccounts(req, res) {
//   const { username, password } = req.body;

//   // Validate required parameters
//   if (!username || !password) {
//     return res.status(400).json({
//       message: 'Username and password are required',
//       debug: { provided: { username: !!username, password: !!password }}
//     });
//   }

//   try {
//     // Query to fetch customer accounts based on login credentials
//     const query = await db.execute(
//       `SELECT DISTINCT 
//         a.FK_CUSTOMER_ID, 
//         c.NAME AS CUSTOMER_NAME, 
//         a.DISP_NAME,
//         a.FK_CUST_GROUP_ID,
//         CASE 
//           WHEN a.DISP_NAME = b.DISP_NAME THEN 1 
//           ELSE 0 
//         END AS DEF
//       FROM SYSTEM.CUSTOMER_LOGIN1 a
//       JOIN SYSTEM.CUSTOMER_LOGIN1 b 
//         ON a.FK_CUST_GROUP_ID = b.FK_CUST_GROUP_ID
//       JOIN SYSTEM.CUSTOMER_MASTER c
//         ON a.FK_CUSTOMER_ID = c.ID
//       WHERE b.USER_NAME = :username 
//         AND b.USER_PASSWORD = :password
//       ORDER BY a.DISP_NAME`,
//       { 
//         username,
//         password
//       },
//       { outFormat: oracledb.OUT_FORMAT_OBJECT }
//     );

//     const accounts = query.rows || [];

//     // Return the fetched data
//     res.json({
//       input: { username },  // Excluding password from response for security
//       output: {
//         count: accounts.length,
//         accounts: accounts.map(row => ({
//           FK_CUSTOMER_ID: row.FK_CUSTOMER_ID,
//           CUSTOMER_NAME: row.CUSTOMER_NAME,
//           DISP_NAME: row.DISP_NAME,
//           FK_CUST_GROUP_ID: row.FK_CUST_GROUP_ID,
//           DEF: row.DEF
//         }))
//       }
//     });

//   } catch (error) {
//     console.error('Database error:', error);
//     res.status(500).json({
//       message: 'Failed to fetch customer accounts',
//       debug: error.message
//     });
//   }
// },


async listAccounts(req, res) {
  const { FK_CUST_GROUP_ID } = req.body;

  // Ensure FK_CUST_GROUP_ID is provided
  if (!FK_CUST_GROUP_ID) {
    return res.status(400).json({
      message: 'Customer Group ID is required',
      debug: { provided: { customerGroupId: !!FK_CUST_GROUP_ID }}
    });
  }

  try {
    // Updated query to use FK_CUST_GROUP_ID instead of username/password
    const query = await db.execute(
      `SELECT DISTINCT 
        a.FK_CUSTOMER_ID, 
        c.NAME AS CUSTOMER_NAME, 
        a.DISP_NAME,
        a.FK_CUST_GROUP_ID,
        CASE 
          WHEN a.DISP_NAME = b.DISP_NAME THEN 1 
          ELSE 0 
        END AS DEF
      FROM SYSTEM.CUSTOMER_LOGIN1 a
      JOIN SYSTEM.CUSTOMER_LOGIN1 b 
        ON a.FK_CUST_GROUP_ID = b.FK_CUST_GROUP_ID
      JOIN SYSTEM.CUSTOMER_MASTER c
        ON a.FK_CUSTOMER_ID = c.ID
      WHERE a.FK_CUST_GROUP_ID = :FK_CUST_GROUP_ID
      ORDER BY a.DISP_NAME`,
      { FK_CUST_GROUP_ID }, // Single bind parameter
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const groups = query.rows || [];

    // Return the fetched data
    res.json({
      input: { FK_CUST_GROUP_ID },
      output: {
        count: groups.length,
        groups: groups.map(row => ({
          FK_CUSTOMER_ID: row.FK_CUSTOMER_ID,
          DISP_NAME: row.DISP_NAME,
          DEF: row.DEF,
          FK_CUST_GROUP_ID: row.FK_CUST_GROUP_ID,
          CUSTOMER_NAME: row.CUSTOMER_NAME
        }))
      }
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      message: 'Server error',
      debug: error.message
    });
  }
},

async getItemCatSubCat(req, res) {
  const { CustomerID } = req.body;
  const { displayName } = req.user;
  
  if (!CustomerID) {
      return res.status(400).json({ message: 'CustomerID is required' });
  }

  try {
      // First verify if the customer exists
      const customerCheck = await db.execute(
          // `SELECT CL.FK_CUSTOMER_ID 
          //  FROM CUSTOMER_LOGIN CL
          //  JOIN CUSTOMER C ON CL.FK_CUSTOMER_ID = C.CUSTOMER_ID
          //  WHERE CL.FK_CUSTOMER_ID = :1`
          `SELECT FK_CUSTOMER_ID 
            FROM CUSTOMER_LOGIN1
            WHERE FK_CUSTOMER_ID = :1`,
          [CustomerID],  // Use array for binding parameters
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (customerCheck.rows.length === 0) {
          return res.status(404).json({ 
              message: 'Customer not found',
              debug: `No customer found with ID: ${CustomerID}`
          });
      }

      // Get categories and subcategories
      const result = await db.execute(
          `SELECT DISTINCT 
               c.ITEM_CATEG_ID AS CATID,
               c.ITEM_CATEG_CODE AS CATCODE,
               c.ITEM_CATEG_NAME AS CATDESC,
               d.ITEM_SUB_CATEGORY_ID AS SUBCATID,
               d.SUB_CATEGORY_CODE AS SUBCATCODE,
               d.SUB_CATEGORY_NAME AS SUBCATDESC,
               'C' || c.ITEM_CATEG_ID || '.jpg' AS CATEGORY_IMAGE_NAME,
               'SC' || d.ITEM_SUB_CATEGORY_ID || '.jpg' AS SUBCATEGORY_IMAGE_NAME
           FROM SYSTEM.STOCK_LOTNO a 
           INNER JOIN ITEM_MASTER b ON a.FK_ITEM_ID = b.ITEM_ID
           INNER JOIN ITEM_CATEGORY c ON b.FK_CATEGORY_ID = c.ITEM_CATEG_ID
           INNER JOIN ITEM_SUB_CATEGORY d ON b.FK_SUBCATEGORY_ID = d.ITEM_SUB_CATEGORY_ID
           WHERE a.FK_CUSTOMER_ID = :1
           ORDER BY c.ITEM_CATEG_ID, d.ITEM_SUB_CATEGORY_ID`,
          [CustomerID],  // Use array for binding parameters
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (result.rows && result.rows.length > 0) {
          res.json({
              input: { CustomerID, displayName },
              output: result.rows
          });
      } else {
          res.status(404).json({ 
              message: 'No categories found',
              debug: `No data found for CustomerID: ${CustomerID}`
          });
      }

  } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ 
          message: 'Server error',
          debug: error.message 
      });
  }
},
async getItemsBySubCategory(req, res) {
  let connection;
  try {
      const { SubCategoryID, CustomerID } = req.body;

      // Input validation
      if (!SubCategoryID || !CustomerID) {
          return res.status(400).json({
              status: 'error',
              message: 'SubCategoryID and CustomerID are required'
          });
      }

      // Convert to numbers explicitly
      const subCategoryIdNumber = parseInt(SubCategoryID, 10);
      const customerIdNumber = parseInt(CustomerID, 10);

      // Validate numbers
      if (isNaN(subCategoryIdNumber) || isNaN(customerIdNumber)) {
          return res.status(400).json({
              status: 'error',
              message: 'SubCategoryID and CustomerID must be valid numbers'
          });
      }

      connection = await oracledb.getConnection();
      
      const result = await connection.execute(
          `SELECT DISTINCT 
              d.ITEM_SUB_CATEGORY_ID,
              b.ITEM_ID,
              b.ITEM_CODE,
              b.DESCRIPTION,
              b.ITEM_NAME
          FROM SYSTEM.STOCK_LOTNO a 
          INNER JOIN ITEM_MASTER b ON a.FK_ITEM_ID = b.ITEM_ID
          INNER JOIN ITEM_CATEGORY c ON b.FK_CATEGORY_ID = c.ITEM_CATEG_ID
          INNER JOIN ITEM_SUB_CATEGORY d ON b.FK_SUBCATEGORY_ID = d.ITEM_SUB_CATEGORY_ID
          WHERE a.FK_CUSTOMER_ID = :CustomerID 
          AND b.FK_SUBCATEGORY_ID = :SubCategoryID
          GROUP BY 
              d.ITEM_SUB_CATEGORY_ID,
              b.ITEM_ID,
              b.ITEM_CODE,
              b.DESCRIPTION,
              b.ITEM_NAME
          ORDER BY b.ITEM_ID`,
          {
              CustomerID: { val: customerIdNumber, type: oracledb.NUMBER },
              SubCategoryID: { val: subCategoryIdNumber, type: oracledb.NUMBER }
          },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (result.rows.length === 0) {
          return res.status(404).json({
              status: 'error',
              message: 'No items found for this subcategory'
          });
      }

      return res.status(200).json({
          status: 'success',
          input: { SubCategoryID: subCategoryIdNumber, CustomerID: customerIdNumber },
          output: {
              items: result.rows
          }
      });

  } catch (error) {
      console.error('Error in getItemsBySubCategory:', error);
      return res.status(500).json({
          status: 'error',
          message: 'Internal server error',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
  } finally {
      if (connection) {
          try {
              await connection.close();
          } catch (error) {
              console.error('Error closing connection:', error);
          }
      }
  }
},

// async getItemsBySubCategory(req, res) {
//   const { SubCategoryID, CustomerID } = req.body;

//   if (!SubCategoryID || !CustomerID) {
//       return res.status(400).json({ 
//           message: 'SubCategoryID and CustomerID are required' 
//       });
//   }

//     try {
//       const itemsResult = await db.execute(
//         // `SELECT DISTINCT
//         //   ITEM_ID,
//         //   ITEM_CODE,
//         //   DESCRIPTION,
//         //   ITEM_NAME,
//         //   BALANCE_QTY_SUM
//         // FROM LISTOFITEMS
//         // WHERE ITEM_SUB_CATEGORY_ID = :SubCategoryID
//         // ORDER BY ITEM_ID
//         `SELECT DISTINCT 
//                d.ITEM_SUB_CATEGORY_ID,
//                b.ITEM_ID,
//                b.ITEM_CODE,
//                b.DESCRIPTION,
//                b.ITEM_NAME,
//            FROM SYSTEM.STOCK_LOTNO a 
//            INNER JOIN ITEM_MASTER b ON a.FK_ITEM_ID = b.ITEM_ID
//            INNER JOIN ITEM_CATEGORY c ON b.FK_CATEGORY_ID = c.ITEM_CATEG_ID
//            INNER JOIN ITEM_SUB_CATEGORY d ON b.FK_SUBCATEGORY_ID = d.ITEM_SUB_CATEGORY_ID
//            WHERE a.FK_CUSTOMER_ID = :CustomerID 
//            AND b.FK_SUBCATEGORY_ID = :SubCategoryID
//            GROUP BY 
//                d.ITEM_SUB_CATEGORY_ID,
//                b.ITEM_ID,
//                b.ITEM_CODE,
//                b.DESCRIPTION,
//                b.ITEM_NAME
//            ORDER BY b.ITEM_ID`,
//            {
//                CustomerID,
//                SubCategoryID
//            },
//            { outFormat: oracledb.OUT_FORMAT_OBJECT });
//       //  );`,
//       //   { SubCategoryID },
//       //   { outFormat: oracledb.OUT_FORMAT_OBJECT }
//       // );

//       if (itemsResult.rows.length === 0) {
//         return res.status(404).json({ message: 'No items found for this subcategory' });
//       }

//       const response = {
//         input: { SubCategoryID },
//         output: {
//           items: itemsResult.rows
//         }
//       };

//       res.json(response);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   },

//   getItemDetailsWithStock: async (req, res) => {
//     const { ItemID } = req.body;

//     const parsedItemID = parseInt(ItemID, 10);
//     if (isNaN(parsedItemID)) {
//       return res.status(400).json({ message: 'Invalid ItemID. Must be a number.' });
//     }

//     try {
//       const result = await db.execute(
//         `SELECT DISTINCT
//           l.ITEM_SUB_CATEGORY_ID,
//           l.ITEM_ID,
//           l.ITEM_CODE,
//           l.DESCRIPTION,
//           l.ITEM_NAME,
//           s.LOT_NO,
//           s.FK_UNIT_ID,
//           s.ITEM_MARKS,
//           s.VAKAL_NO,
//           s.BATCH_NO,
//           l.BALANCE_QTY_SUM,
//           s.AVAILABLE_QTY,
//           s.BOX_QUANTITY,
//           s.EXPIRY_DATE,
//           s.REMARKS,
//           s.UNIT_NAME
//         FROM 
//           LISTOFITEMS l
//         LEFT JOIN
//           itemstockdetails s ON l.ITEM_ID = s.ITEM_ID
//         WHERE 
//           l.ITEM_ID = :ItemID`,
//         { ItemID: parsedItemID },
//         { outFormat: oracledb.OUT_FORMAT_OBJECT }
//       );

//       if (result.rows.length === 0) {
//         return res.status(404).json({ message: 'Item not found' });
//       }

//       const itemDetails = result.rows[0];
//       const stockDetails = result.rows.map(row => ({
//         LOT_NO: row.LOT_NO,
//         FK_UNIT_ID: row.FK_UNIT_ID,
//         ITEM_MARKS: row.ITEM_MARKS,
//         VAKAL_NO: row.VAKAL_NO,
//         BATCH_NO: row.BATCH_NO,
//         BALANCE_QTY: row.BALANCE_QTY,
//         AVAILABLE_QTY: row.AVAILABLE_QTY,
//         BOX_QUANTITY: row.BOX_QUANTITY,
//         EXPIRY_DATE: row.EXPIRY_DATE,
//         REMARKS: row.REMARKS,
//         // STATUS: row.STATUS,
//         UNIT_NAME:row.UNIT_NAME
//       }));

//       const response = {
//         input: { ItemID: parsedItemID },
//         output: {
//           itemDetails: {
//             ITEM_SUB_CATEGORY_ID: itemDetails.ITEM_SUB_CATEGORY_ID,
//             ITEM_ID: itemDetails.ITEM_ID,
//             ITEM_CODE: itemDetails.ITEM_CODE,
//             DESCRIPTION: itemDetails.DESCRIPTION,
//             ITEM_NAME: itemDetails.ITEM_NAME
//           },
//           stockDetails: stockDetails
//         }
//       };

//       res.json(response);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   }
// };

//  async getItemDetailsWithStock(req, res)  {
//   const { ItemID } = req.body;

//   console.log('Received ItemID:', ItemID); // Log the received ItemID

//   const parsedItemID = parseInt(ItemID, 10);
//   if (isNaN(parsedItemID)) {
//     console.log('Invalid ItemID:', ItemID); // Log invalid ItemID
//     return res.status(400).json({ message: 'Invalid ItemID. Must be a number.' });
//   }

//   try {
//     console.log('Executing SQL query for ItemID:', parsedItemID); // Log before query execution

//     const result = await db.execute(
//       `SELECT DISTINCT
//         l.ITEM_SUB_CATEGORY_ID,
//         l.ITEM_ID,
//         l.ITEM_CODE,
//         l.DESCRIPTION,
//         l.ITEM_NAME,
//         s.LOT_NO,
//         s.FK_UNIT_ID,
//         s.ITEM_MARKS,
//         s.VAKAL_NO,
//         s.BATCH_NO,
//         l.BALANCE_QTY_SUM,
//         s.AVAILABLE_QTY,
//         s.BOX_QUANTITY,
//         s.EXPIRY_DATE,
//         s.REMARKS,
//         s.UNIT_NAME
//       FROM 
//         LISTOFITEMS l
//       LEFT JOIN
//         itemstockdetails s ON l.ITEM_ID = s.ITEM_ID
//       WHERE 
//         l.ITEM_ID = :ItemID`,
//       { ItemID: parsedItemID },
//       { outFormat: oracledb.OUT_FORMAT_OBJECT }
//     );

//     console.log('Query result rows count:', result.rows.length); // Log number of rows returned

//     if (result.rows.length === 0) {
//       console.log('No items found for ItemID:', parsedItemID); // Log when no items are found
//       return res.status(404).json({ message: 'Item not found' });
//     }

//     // Log the first row of the result to see what data is being fetched
//     console.log('First row of result:', result.rows[0]);

//     const itemDetails = result.rows[0];
//     const stockDetails = result.rows.map(row => ({
//       LOT_NO: row.LOT_NO,
//       FK_UNIT_ID: row.FK_UNIT_ID,
//       ITEM_MARKS: row.ITEM_MARKS,
//       VAKAL_NO: row.VAKAL_NO,
//       BATCH_NO: row.BATCH_NO,
//       BALANCE_QTY: row.BALANCE_QTY,
//       AVAILABLE_QTY: row.AVAILABLE_QTY,
//       BOX_QUANTITY: row.BOX_QUANTITY,
//       EXPIRY_DATE: row.EXPIRY_DATE,
//       REMARKS: row.REMARKS,
//       UNIT_NAME: row.UNIT_NAME
//     }));

//     // Log the stockDetails to verify the mapped data
//     console.log('Stock Details:', stockDetails);

//     const response = {
//       input: { ItemID: parsedItemID },
//       output: {
//         itemDetails: {
//           ITEM_SUB_CATEGORY_ID: itemDetails.ITEM_SUB_CATEGORY_ID,
//           ITEM_ID: itemDetails.ITEM_ID,
//           ITEM_CODE: itemDetails.ITEM_CODE,
//           DESCRIPTION: itemDetails.DESCRIPTION,
//           ITEM_NAME: itemDetails.ITEM_NAME
//         },
//         stockDetails: stockDetails
//       }
//     };

//     // Log the entire response before sending
//     console.log('Final Response:', JSON.stringify(response, null, 2));

//     res.json(response);
//   } catch (error) {
//     console.error('Error in getItemDetailsWithStock:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// }


  // async getItemDetailsWithStock(req, res) {
  //   const { ItemID } = req.body;

  //   // Validate ItemID
  //   const parsedItemID = parseInt(ItemID, 10);
  //   if (isNaN(parsedItemID)) {
  //     return res.status(400).json({ 
  //       success: false,
  //       message: 'Invalid ItemID. Must be a number.' 
  //     });
  //   }

  //   try {
  //     // Optimized single query to fetch item and stock details
  //     const query = `
  //       SELECT DISTINCT
  //         b.ITEM_ID,
  //         b.ITEM_CODE,
  //         b.DESCRIPTION,
  //         b.ITEM_NAME,
  //         c.ITEM_CATEG_ID,
  //         d.ITEM_SUB_CATEGORY_ID,
  //         a.LOT_NO,
  //         a.ITEM_MARKS,
  //         a.VAKAL_NO,
  //         a.BATCH_NO,
  //         a.BALANCE_QTY,
  //         a.AVAILABLE_QTY,
  //         a.BOX_QUANTITY,
  //         a.EXPIRY_DATE,
  //         a.REMARKS,
  //         a.STATUS,
  //         e.UNIT_NAME
  //       FROM 
  //         SYSTEM.STOCK_LOTNO a 
  //       INNER JOIN 
  //         ITEM_MASTER b ON a.FK_ITEM_ID = b.ITEM_ID
  //       INNER JOIN 
  //         ITEM_CATEGORY c ON b.FK_CATEGORY_ID = c.ITEM_CATEG_ID
  //       INNER JOIN 
  //         ITEM_SUB_CATEGORY d ON b.FK_SUBCATEGORY_ID = d.ITEM_SUB_CATEGORY_ID
  //       LEFT JOIN 
  //         UNIT_MASTER e ON a.FK_UNIT_ID = e.UNIT_ID
  //       WHERE 
  //         a.FK_CUSTOMER_ID = :CustomerId 
  //         AND b.ITEM_ID = :ItemID
  //     `;

  //     // Execute query with parameters
  //     const result = await db.execute(query, {
  //       CustomerId: 520,  // Hard-coded as per original query
  //       ItemID: parsedItemID
  //     }, {
  //       outFormat: oracledb.OUT_FORMAT_OBJECT
  //     });

  //     // Check if any results found
  //     if (result.rows.length === 0) {
  //       return res.status(404).json({ 
  //         success: false,
  //         message: 'No stock details found for the specified item' 
  //       });
  //     }

  //     // Prepare response object
  //     const response = {
  //       success: true,
  //       input: { ItemID: parsedItemID },
  //       output: {
  //         itemDetails: {
  //           ITEM_ID: result.rows[0].ITEM_ID,
  //           ITEM_CODE: result.rows[0].ITEM_CODE,
  //           DESCRIPTION: result.rows[0].DESCRIPTION,
  //           ITEM_NAME: result.rows[0].ITEM_NAME,
  //           ITEM_CATEGORY_ID: result.rows[0].ITEM_CATEG_ID,
  //           ITEM_SUB_CATEGORY_ID: result.rows[0].ITEM_SUB_CATEGORY_ID
  //         },
  //         stockDetails: result.rows.map(row => ({
  //           LOT_NO: row.LOT_NO,
  //           ITEM_MARKS: row.ITEM_MARKS,
  //           VAKAL_NO: row.VAKAL_NO,
  //           BATCH_NO: row.BATCH_NO,
  //           BALANCE_QTY: row.BALANCE_QTY,
  //           AVAILABLE_QTY: row.AVAILABLE_QTY,
  //           BOX_QUANTITY: row.BOX_QUANTITY,
  //           EXPIRY_DATE: row.EXPIRY_DATE,
  //           REMARKS: row.REMARKS,
  //           STATUS: row.STATUS,
  //           UNIT_NAME: row.UNIT_NAME
  //         }))
  //       }
  //     };

  //     // Send response
  //     return res.status(200).json(response);

  //   } catch (error) {
  //     console.error('Error in getItemDetailsWithStock:', error);
  //     return res.status(500).json({ 
  //       success: false,
  //       message: 'Server error', 
  //       error: error.message 
  //     });
  //   }
  // }

  async getItemDetailsWithStock(req, res) {
    const { ItemID, CustomerID } = req.body;

    // Validate ItemID
    const parsedItemID = parseInt(ItemID, 10);
    const parsedCustomerID = parseInt(CustomerID, 10);

    // Validate input parameters
    if (isNaN(parsedItemID)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid ItemID. Must be a number.' 
      });
    }

    if (isNaN(parsedCustomerID)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid CustomerID. Must be a number.' 
      });
    }

    try {
      // Optimized single query to fetch item and stock details
      const query = `
        SELECT DISTINCT
          b.ITEM_ID,
          b.ITEM_CODE,
          b.DESCRIPTION,
          b.ITEM_NAME,
          c.ITEM_CATEG_ID,
          d.ITEM_SUB_CATEGORY_ID,
          a.LOT_NO,
          a.ITEM_MARKS,
          a.VAKAL_NO,
          a.BATCH_NO,
          a.BALANCE_QTY,
          a.AVAILABLE_QTY,
          a.BOX_QUANTITY,
          a.EXPIRY_DATE,
          a.REMARKS,
          a.STATUS,
          e.UNIT_NAME
        FROM 
          SYSTEM.STOCK_LOTNO a 
        INNER JOIN 
          ITEM_MASTER b ON a.FK_ITEM_ID = b.ITEM_ID
        INNER JOIN 
          ITEM_CATEGORY c ON b.FK_CATEGORY_ID = c.ITEM_CATEG_ID
        INNER JOIN 
          ITEM_SUB_CATEGORY d ON b.FK_SUBCATEGORY_ID = d.ITEM_SUB_CATEGORY_ID
        LEFT JOIN 
          UNIT_MASTER e ON a.FK_UNIT_ID = e.UNIT_ID
        WHERE 
          a.FK_CUSTOMER_ID = :CustomerId 
          AND a.AVAILABLE_QTY > 0
          AND b.ITEM_ID = :ItemID
      `;

      // Execute query with parameters from input
      const result = await db.execute(query, {
        CustomerId: parsedCustomerID,
        ItemID: parsedItemID
      }, {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      });

      // Check if any results found
      if (result.rows.length === 0) {
        return res.status(404).json({ 
          success: false,
          message: 'No stock details found for the specified item and customer' 
        });
      }

      // Prepare response object
      const response = {
        success: true,
        input: { 
          ItemID: parsedItemID,
          CustomerID: parsedCustomerID 
        },
        output: {
          itemDetails: {
            ITEM_ID: result.rows[0].ITEM_ID,
            ITEM_CODE: result.rows[0].ITEM_CODE,
            DESCRIPTION: result.rows[0].DESCRIPTION,
            ITEM_NAME: result.rows[0].ITEM_NAME,
            ITEM_CATEGORY_ID: result.rows[0].ITEM_CATEG_ID,
            ITEM_SUB_CATEGORY_ID: result.rows[0].ITEM_SUB_CATEGORY_ID
          },
          stockDetails: result.rows.map(row => ({
            LOT_NO: row.LOT_NO,
            ITEM_MARKS: row.ITEM_MARKS,
            VAKAL_NO: row.VAKAL_NO,
            BATCH_NO: row.BATCH_NO,
            BALANCE_QTY: row.BALANCE_QTY,
            AVAILABLE_QTY: row.AVAILABLE_QTY,
            BOX_QUANTITY: row.BOX_QUANTITY,
            EXPIRY_DATE: row.EXPIRY_DATE,
            REMARKS: row.REMARKS,
            STATUS: row.STATUS,
            UNIT_NAME: row.UNIT_NAME
          }))
        }
      };

      // Send response
      return res.status(200).json(response);

    } catch (error) {
      console.error('Error in getItemDetailsWithStock:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Server error', 
        error: error.message 
      });
    }
  }
}


module.exports = authController;

