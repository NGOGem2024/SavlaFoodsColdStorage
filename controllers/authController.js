
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
    const userCheck = await db.execute(
      `SELECT DISTINCT
        CL.FK_CUSTOMER_ID, 
        CL.MOBILE_NO, 
        CL.PASSWORD, 
        CL.FK_CUST_GROUP_ID,
        C.DISP_NAME,
        C.CUSTOMER_NAME -- Ensure CUSTOMER_NAME is correct column name
       FROM CUSTOMER_LOGIN CL
       JOIN CUSTOMER C ON CL.FK_CUSTOMER_ID = C.CUSTOMER_ID
       WHERE UPPER(CL.USERNAME) = UPPER(:sf_userName)`,
      { sf_userName: sf_userName.trim() },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!userCheck.rows || userCheck.rows.length === 0) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        debug: 'Username not found'
      });
    }

    const user = userCheck.rows[0];
    if (user.PASSWORD !== sf_userPwd) {
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
    // Updated query to fetch the required fields based on FK_CUST_GROUP_ID
    const query = await db.execute(
      `SELECT DISTINCT
        cg.FK_CUSTOMER_ID,
        cg.DISP_NAME,
        cg.DEF,
        cg.FK_CUST_GROUP_ID,
        cg.CUSTOMER_NAME 
       FROM CUST_GROUP cg
       WHERE cg.FK_CUST_GROUP_ID = :FK_CUST_GROUP_ID
       ORDER BY cg.DISP_NAME`,
      { FK_CUST_GROUP_ID },  // Only passing FK_CUST_GROUP_ID
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
          `SELECT CL.FK_CUSTOMER_ID 
           FROM CUSTOMER_LOGIN CL
           JOIN CUSTOMER C ON CL.FK_CUSTOMER_ID = C.CUSTOMER_ID
           WHERE CL.FK_CUSTOMER_ID = :1`,
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
              ICS.ITEM_CATEG_ID AS CATID,
              ICS.ITEM_CATEG_CODE AS CATCODE,
              ICS.ITEM_CATEG_NAME AS CATDESC,
              ICS.ITEM_SUB_CATEGORY_ID AS SUBCATID,
              ICS.SUB_CATEGORY_CODE AS SUBCATCODE,
              ICS.SUB_CATEGORY_NAME AS SUBCATDESC,          
              'C' || ICS.ITEM_CATEG_ID || '.jpg' AS CATEGORY_IMAGE_NAME,
              'SC' || ICS.ITEM_SUB_CATEGORY_ID || '.jpg' AS SUBCATEGORY_IMAGE_NAME
          FROM 
              ITEMCAT_SUBCAT ICS
          INNER JOIN 
              CUSTOMER_LOGIN CL ON ICS.FK_CUSTOMER_ID = CL.FK_CUSTOMER_ID
          WHERE 
              CL.FK_CUSTOMER_ID = :1
          ORDER BY 
              ICS.ITEM_CATEG_ID, 
              ICS.ITEM_SUB_CATEGORY_ID`,
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


  getItemsBySubCategory: async (req, res) => {
    const { SubCategoryID } = req.body;

    try {
      const itemsResult = await db.execute(
        `SELECT DISTINCT
          ITEM_ID,
          ITEM_CODE,
          DESCRIPTION,
          ITEM_NAME,
          BALANCE_QTY_SUM
        FROM LISTOFITEMS
        WHERE ITEM_SUB_CATEGORY_ID = :SubCategoryID
        ORDER BY ITEM_ID`,
        { SubCategoryID },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (itemsResult.rows.length === 0) {
        return res.status(404).json({ message: 'No items found for this subcategory' });
      }

      const response = {
        input: { SubCategoryID },
        output: {
          items: itemsResult.rows
        }
      };

      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

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

 async getItemDetailsWithStock(req, res)  {
  const { ItemID } = req.body;

  console.log('Received ItemID:', ItemID); // Log the received ItemID

  const parsedItemID = parseInt(ItemID, 10);
  if (isNaN(parsedItemID)) {
    console.log('Invalid ItemID:', ItemID); // Log invalid ItemID
    return res.status(400).json({ message: 'Invalid ItemID. Must be a number.' });
  }

  try {
    console.log('Executing SQL query for ItemID:', parsedItemID); // Log before query execution

    const result = await db.execute(
      `SELECT DISTINCT
        l.ITEM_SUB_CATEGORY_ID,
        l.ITEM_ID,
        l.ITEM_CODE,
        l.DESCRIPTION,
        l.ITEM_NAME,
        s.LOT_NO,
        s.FK_UNIT_ID,
        s.ITEM_MARKS,
        s.VAKAL_NO,
        s.BATCH_NO,
        l.BALANCE_QTY_SUM,
        s.AVAILABLE_QTY,
        s.BOX_QUANTITY,
        s.EXPIRY_DATE,
        s.REMARKS,
        s.UNIT_NAME
      FROM 
        LISTOFITEMS l
      LEFT JOIN
        itemstockdetails s ON l.ITEM_ID = s.ITEM_ID
      WHERE 
        l.ITEM_ID = :ItemID`,
      { ItemID: parsedItemID },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log('Query result rows count:', result.rows.length); // Log number of rows returned

    if (result.rows.length === 0) {
      console.log('No items found for ItemID:', parsedItemID); // Log when no items are found
      return res.status(404).json({ message: 'Item not found' });
    }

    // Log the first row of the result to see what data is being fetched
    console.log('First row of result:', result.rows[0]);

    const itemDetails = result.rows[0];
    const stockDetails = result.rows.map(row => ({
      LOT_NO: row.LOT_NO,
      FK_UNIT_ID: row.FK_UNIT_ID,
      ITEM_MARKS: row.ITEM_MARKS,
      VAKAL_NO: row.VAKAL_NO,
      BATCH_NO: row.BATCH_NO,
      BALANCE_QTY: row.BALANCE_QTY,
      AVAILABLE_QTY: row.AVAILABLE_QTY,
      BOX_QUANTITY: row.BOX_QUANTITY,
      EXPIRY_DATE: row.EXPIRY_DATE,
      REMARKS: row.REMARKS,
      UNIT_NAME: row.UNIT_NAME
    }));

    // Log the stockDetails to verify the mapped data
    console.log('Stock Details:', stockDetails);

    const response = {
      input: { ItemID: parsedItemID },
      output: {
        itemDetails: {
          ITEM_SUB_CATEGORY_ID: itemDetails.ITEM_SUB_CATEGORY_ID,
          ITEM_ID: itemDetails.ITEM_ID,
          ITEM_CODE: itemDetails.ITEM_CODE,
          DESCRIPTION: itemDetails.DESCRIPTION,
          ITEM_NAME: itemDetails.ITEM_NAME
        },
        stockDetails: stockDetails
      }
    };

    // Log the entire response before sending
    console.log('Final Response:', JSON.stringify(response, null, 2));

    res.json(response);
  } catch (error) {
    console.error('Error in getItemDetailsWithStock:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
}
module.exports = authController;

