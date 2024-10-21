
// //finalfinal

const jwt = require('jsonwebtoken');
const oracledb = require('oracledb');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ';

const authController = {
  getUserAccountID: async (req, res) => {
    const { sf_userName, sf_userPwd } = req.body;
    
    if (!sf_userName || !sf_userPwd) {
      return res.status(400).json({ 
        message: 'Username and password are required',
        debug: { provided: { username: !!sf_userName, password: !!sf_userPwd }}
      });
    }
    
    try {
      const userCheck = await db.execute(
        `SELECT CL.FK_CUSTOMER_ID, CL.MOBILE_NO, CL.PASSWORD, C.DISP_NAME  
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
          displayName: user.DISP_NAME
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

  getItemCatSubCat: async (req, res) => {
    const { CustomerID } = req.body;
    const { displayName } = req.user; // Get displayName from the authenticated user
    
    try {
      const customerCheck = await db.execute(
        `SELECT FK_CUSTOMER_ID 
         FROM CUSTOMER_LOGIN 
         WHERE FK_CUSTOMER_ID = :CustomerID`,
        { CustomerID },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (customerCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      const result = await db.execute(
        `SELECT 
           ITEM_CATEG_ID AS CATID,
           ITEM_CATEG_CODE AS CATCODE,
           ITEM_CATEG_NAME AS CATDESC,
           ITEM_SUB_CATEGORY_ID AS SUBCATID,
           SUB_CATEGORY_CODE AS SUBCATCODE,
           SUB_CATEGORY_NAME AS SUBCATDESC,
           CAT_IMGFILE,
           SUBCAT_IMGFILE
         FROM ITEMCAT_SUBCAT`,
        {},
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (result.rows && result.rows.length > 0) {
        res.json({
          input: { CustomerID, displayName },
          output: result.rows
        });
      } else {
        res.status(404).json({ message: 'No item categories or subcategories found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  getItemsBySubCategory: async (req, res) => {
    const { SubCategoryID } = req.body;

    try {
      const itemsResult = await db.execute(
        `SELECT 
          ITEM_ID,
          ITEM_CODE,
          DESCRIPTION,
          ITEM_NAME
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

  getItemDetailsWithStock: async (req, res) => {
    const { ItemID } = req.body;

    const parsedItemID = parseInt(ItemID, 10);
    if (isNaN(parsedItemID)) {
      return res.status(400).json({ message: 'Invalid ItemID. Must be a number.' });
    }

    try {
      const result = await db.execute(
        `SELECT 
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
          s.BALANCE_QTY,
          s.AVAILABLE_QTY,
          s.BOX_QUANTITY,
          s.EXPIRY_DATE,
          s.REMARKS,
          s.STATUS
        FROM 
          LISTOFITEMS l
        LEFT JOIN
          itemstockdetails s ON l.ITEM_ID = s.ITEM_ID
        WHERE 
          l.ITEM_ID = :ItemID`,
        { ItemID: parsedItemID },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Item not found' });
      }

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
        STATUS: row.STATUS
      }));

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

      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = authController;


// const oracledb = require('oracledb');
// const db = require('../config/database');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const path = require('path');

// const authController = {
//   async getUserAccountID(req, res) {
//     const { sf_userName, sf_userPwd } = req.body;
    
//     try {
//       const result = await db.execute(
//         `SELECT FK_CUSTOMER_ID, PASSWORD
//          FROM CUSTOMER_LOGIN
//          WHERE USERNAME = :sf_userName`,
//         { sf_userName },
//         { outFormat: oracledb.OUT_FORMAT_OBJECT }
//       );
      
//       if (result.rows && result.rows.length > 0) {
//         const { FK_CUSTOMER_ID, PASSWORD } = result.rows[0];
        
//         // Compare the provided password with the stored hash
//         const isMatch = await bcrypt.compare(sf_userPwd, PASSWORD);
        
//         if (isMatch) {
//           // Generate JWT token
//           const token = jwt.sign(
//             { userId: FK_CUSTOMER_ID },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//           );
          
//           res.json({
//             message: 'Login successful',
//             token,
//             CustomerID: FK_CUSTOMER_ID
//           });
//         } else {
//           res.status(401).json({ message: 'Invalid credentials' });
//         }
//       } else {
//         res.status(401).json({ message: 'Invalid credentials' });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   },


//  async getCustomerID (req, res) {
//     try {
//       // This is a placeholder query. You'll need to replace it with your actual logic
//       // to retrieve or generate a CustomerID
//       const result = await db.execute(
//         `SELECT CUSTOMER_ID FROM CUSTOMERS WHERE ROWNUM = 1`,
//         [],
//         { outFormat: oracledb.OUT_FORMAT_OBJECT }
//       );
  
//       if (result.rows && result.rows.length > 0) {
//         res.json({ customerID: result.rows[0].CUSTOMER_ID });
//       } else {
//         res.status(404).json({ message: 'No CustomerID found' });
//       }
//     } catch (error) {
//       console.error('Error fetching CustomerID:', error);
//       res.status(500).json({ message: 'Server error', error: error.message });
//     }
//  },
  
 
//   async imageName (req, res) {
//   try {
//     const imageDirectory = path.join(__dirname, '..', 'public', 'assets');
//     const files = await fs.readdir(imageDirectory);
//     const matchingFile = files.find(file => file.startsWith(req.params.imageName));
    
//     if (matchingFile) {
//       res.sendFile(path.join(imageDirectory, matchingFile));
//     } else {
//       res.status(404).send('Image not found');
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// },


// async getItemCatSubCat(req, res) {
//   const { CustomerID } = req.body;
//   if (!CustomerID) {
//     return res.status(400).json({ message: 'CustomerID is required' });
//   }

//   try {
//     console.log('Received request for CustomerID:', CustomerID);

//     const connection = await oracledb.getConnection();
    
//     const result = await connection.execute(
//       `SELECT DISTINCT
//          ITEM_CATEG_ID AS CATID,
//          ITEM_CATEG_CODE AS CATCODE,
//          ITEM_CATEG_NAME AS CATDESC,
//          CAT_IMGFILE
//        FROM ITEMCAT_SUBCAT
//        WHERE ITEM_CATEG_ID IN (
//          SELECT DISTINCT FK_ITEM_CATEG_ID
//          FROM CUSTOMER_PRICE_LIST
//          WHERE FK_CUSTOMER_ID = :CustomerID
//        )`,
//       { CustomerID },
//       { outFormat: oracledb.OUT_FORMAT_OBJECT }
//     );

//     await connection.close();

//     console.log('Query result:', result);

//     if (result.rows && result.rows.length > 0) {
//       const processedRows = result.rows.map(row => ({
//         ...row,
//         imageUrl: row.CAT_IMGFILE ? `/api/image/${row.CAT_IMGFILE}` : null
//       }));

//       res.json({
//         input: { CustomerID },
//         output: processedRows
//       });
//     } else {
//       res.status(404).json({ message: 'No item categories found for this customer' });
//     }
//   } catch (error) {
//     console.error('Error in getItemCatSubCat:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// },

// async serveImage(req, res) {
//   const imageName = req.params.imageName;
//   const imageDirectory = path.join(__dirname, '..', 'public', 'assets', 'category_images');
  
//   try {
//     const files = await fs.readdir(imageDirectory);
//     const matchingFile = files.find(file => file.startsWith(imageName));
    
//     if (matchingFile) {
//       res.sendFile(path.join(imageDirectory, matchingFile));
//     } else {
//       res.status(404).send('Image not found');
//     }
//   } catch (error) {
//     console.error('Error serving image:', error);
//     res.status(500).send('Server error');
//   }
// },
//   // Add missing methods
//   async getItemsBySubCategory(req, res) {
//     // Implement the method logic
//   },

//   async getItemDetailsWithStock(req, res) {
//     // Implement the method logic
//   }
// };

// module.exports = authController;