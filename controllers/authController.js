// //finalfinal
 
const jwt = require("jsonwebtoken");
const oracledb = require("oracledb");
const db = require("../config/database");
const EmailService = require('../services/EmailService');
const NotificationService = require('../services/NotificationService');
 
 
 
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ";
 
const authController = {
  // getUserAccountID with customer group information
  async getUserAccountID(req, res) {
    const { sf_userName, sf_userPwd } = req.body;
 
    if (!sf_userName || !sf_userPwd) {
      return res.status(400).json({
        message: "Username and password are required",
        debug: {
          provided: { username: !!sf_userName, password: !!sf_userPwd },
        },
      });
    }
 
    try {
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
          sf_userPwd: sf_userPwd,
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
 
      if (!userCheck.rows || userCheck.rows.length === 0) {
        return res.status(401).json({
          message: "Invalid credentials",
          debug: "Username not found",
        });
      }
 
      const user = userCheck.rows[0];
      if (user.USER_PASSWORD !== sf_userPwd) {
        return res.status(401).json({
          message: "Invalid credentials",
          debug: "Password mismatch",
        });
      }
 
      const token = jwt.sign(
        {
          customerId: user.FK_CUSTOMER_ID,
          username: sf_userName,
          displayName: user.DISP_NAME,
          customerGroupId: user.FK_CUST_GROUP_ID,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
 
      res.json({
        input: { sf_userName },
        output: {
          CustomerID: user.FK_CUSTOMER_ID,
          PhoneNo: user.MOBILE_NO,
          DisplayName: user.DISP_NAME,
          CustomerGroupID: user.FK_CUST_GROUP_ID,
          CustomerName: user.CUSTOMER_NAME, // Ensure this column exists in the 'CUSTOMER' table
          token: token,
        },
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
        message: "Server error",
        debug: error.message,
      });
    }
  },
 
  async listAccounts(req, res) {
    const { FK_CUST_GROUP_ID } = req.body;
 
    console.log("Received request with FK_CUST_GROUP_ID:", FK_CUST_GROUP_ID);
 
    if (!FK_CUST_GROUP_ID) {
      return res.status(400).json({
        message: "Customer Group ID is required",
        debug: { provided: { customerGroupId: !!FK_CUST_GROUP_ID } },
      });
    }
 
    try {
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
      LEFT JOIN SYSTEM.CUSTOMER_LOGIN1 b
        ON a.FK_CUST_GROUP_ID = b.FK_CUST_GROUP_ID
      LEFT JOIN SYSTEM.CUSTOMER_MASTER c
        ON a.FK_CUSTOMER_ID = c.ID
      WHERE a.FK_CUST_GROUP_ID = :FK_CUST_GROUP_ID
      ORDER BY a.DISP_NAME`,
        { FK_CUST_GROUP_ID },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
 
      console.log("Query results:", query.rows);
 
      const groups = query.rows || [];
 
      if (groups.length === 0) {
        console.log("No groups found for FK_CUST_GROUP_ID:", FK_CUST_GROUP_ID);
        return res.status(404).json({
          message: "No customer groups found",
          debug: {
            FK_CUST_GROUP_ID,
            rowCount: 0,
          },
        });
      }
 
      // Remove duplicates by creating a unique key for each record
      const uniqueGroups = Array.from(
        new Map(
          groups.map((item) => [
            `${item.FK_CUSTOMER_ID}-${item.DISP_NAME}`,
            {
              FK_CUSTOMER_ID: item.FK_CUSTOMER_ID,
              DISP_NAME: item.DISP_NAME || "Unknown",
              DEF: item.DEF || 0,
              FK_CUST_GROUP_ID: item.FK_CUST_GROUP_ID,
              CUSTOMER_NAME: item.CUSTOMER_NAME || "Unknown Customer",
            },
          ])
        ).values()
      );
 
      res.json({
        input: { FK_CUST_GROUP_ID },
        output: {
          count: uniqueGroups.length,
          groups: uniqueGroups,
        },
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
        message: "Server error",
        debug: {
          error: error.message,
          FK_CUST_GROUP_ID,
        },
      });
    }
  },
 
  async getItemCatSubCat(req, res) {
    const { CustomerID } = req.body;
    const { displayName } = req.user;
 
    if (!CustomerID) {
      return res.status(400).json({ message: "CustomerID is required" });
    }
 
    try {
      // First verify if the customer exists
      const customerCheck = await db.execute(
        `SELECT FK_CUSTOMER_ID
            FROM CUSTOMER_LOGIN1
            WHERE FK_CUSTOMER_ID = :1`,
        [CustomerID], // Use array for binding parameters
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
 
      if (customerCheck.rows.length === 0) {
        return res.status(404).json({
          message: "Customer not found",
          debug: `No customer found with ID: ${CustomerID}`,
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
        [CustomerID], // Use array for binding parameters
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
 
      if (result.rows && result.rows.length > 0) {
        res.json({
          input: { CustomerID, displayName },
          output: result.rows,
        });
      } else {
        res.status(404).json({
          message: "No categories found",
          debug: `No data found for CustomerID: ${CustomerID}`,
        });
      }
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({
        message: "Server error",
        debug: error.message,
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
          status: "error",
          message: "SubCategoryID and CustomerID are required",
        });
      }
 
      // Convert to numbers explicitly
      const subCategoryIdNumber = parseInt(SubCategoryID, 10);
      const customerIdNumber = parseInt(CustomerID, 10);
 
      // Validate numbers
      if (isNaN(subCategoryIdNumber) || isNaN(customerIdNumber)) {
        return res.status(400).json({
          status: "error",
          message: "SubCategoryID and CustomerID must be valid numbers",
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
          SubCategoryID: { val: subCategoryIdNumber, type: oracledb.NUMBER },
        },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
 
      if (result.rows.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "No items found for this subcategory",
        });
      }
 
      return res.status(200).json({
        status: "success",
        input: {
          SubCategoryID: subCategoryIdNumber,
          CustomerID: customerIdNumber,
        },
        output: {
          items: result.rows,
        },
      });
    } catch (error) {
      console.error("Error in getItemsBySubCategory:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error("Error closing connection:", error);
        }
      }
    }
  },
 
 
  async getItemDetailsWithStock(req, res) {
    const { ItemID, CustomerID } = req.body;
 
    // Validate ItemID
    const parsedItemID = parseInt(ItemID, 10);
    const parsedCustomerID = parseInt(CustomerID, 10);
 
    // Validate input parameters
    if (isNaN(parsedItemID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ItemID. Must be a number.",
      });
    }
 
    if (isNaN(parsedCustomerID)) {
      return res.status(400).json({
        success: false,
        message: "Invalid CustomerID. Must be a number.",
      });
    }
 
    let connection;
    try {
      connection = await db.getConnection();
 
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
 
      const result = await connection.execute(
        query,
        {
          CustomerId: parsedCustomerID,
          ItemID: parsedItemID,
        },
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        }
      );
 
      // Check if any results found
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No stock details found for the specified item and customer",
        });
      }
 
      // Prepare response object
      const response = {
        success: true,
        input: {
          ItemID: parsedItemID,
          CustomerID: parsedCustomerID,
        },
        output: {
          itemDetails: {
            ITEM_ID: result.rows[0].ITEM_ID,
            ITEM_CODE: result.rows[0].ITEM_CODE,
            DESCRIPTION: result.rows[0].DESCRIPTION,
            ITEM_NAME: result.rows[0].ITEM_NAME,
            ITEM_CATEGORY_ID: result.rows[0].ITEM_CATEG_ID,
            ITEM_SUB_CATEGORY_ID: result.rows[0].ITEM_SUB_CATEGORY_ID,
          },
          stockDetails: result.rows.map((row) => ({
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
            UNIT_NAME: row.UNIT_NAME,
          })),
        },
      };
 
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error in getItemDetailsWithStock:", error);
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error("Error closing connection:", error);
        }
      }
    }
  },
 
 
 
 
//23/12

async  getItemDetailsAndUpdateStock(req, res) {
  const { CustomerID, items } = req.body;
  const emailService = new EmailService();
  const notificationService = new NotificationService();
  let connection;

  try {
    connection = await db.getConnection();
    await connection.execute("ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD HH24:MI:SS'");

    // Get customer details
    const customerQuery = `
      SELECT email, disp_name, mobile_no
      FROM customer_login1
      WHERE fk_customer_id = :CustomerID
    `;
    const customerResult = await connection.execute(
      customerQuery,
      { CustomerID },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!customerResult.rows[0]) {
      throw new Error('Customer details not found');
    }

    const { EMAIL, DISP_NAME, MOBILE_NO } = customerResult.rows[0];

    // Fetch item details and validate stock
    const itemDetailsWithNames = [];
    for (const item of items) {
      const { LotNo, ItemID, Quantity } = item;
      
      const itemQuery = `
        SELECT sl.fk_item_id, sl.lot_no, sl.available_qty, im.item_name
        FROM stock_lotno sl
        JOIN item_master im ON sl.fk_item_id = im.item_id
        WHERE sl.fk_customer_id = :CustomerID
          AND sl.fk_item_id = :ItemID
          AND sl.lot_no = :LotNo
      `;
      
      const itemResult = await connection.execute(
        itemQuery,
        { CustomerID, ItemID, LotNo },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (!itemResult.rows[0]) {
        return res.status(404).json({
          success: false,
          message: `Item not found or invalid data for ItemID ${ItemID}, LotNo ${LotNo}`,
        });
      }

      const { ITEM_NAME, AVAILABLE_QTY } = itemResult.rows[0];

      if (AVAILABLE_QTY < Quantity) {
        return res.status(404).json({
          success: false,
          message: `Insufficient stock for ${ITEM_NAME} (ItemID: ${ItemID}, LotNo: ${LotNo})`,
        });
      }

      itemDetailsWithNames.push({
        ...item,
        itemName: ITEM_NAME,
        Quantity // Add Quantity to match the NotificationService's expected format
      });
    }

    // Generate Order ID
    const orderSeqQuery = `SELECT SYSTEM.ORDER_SEQ.NEXTVAL AS ORDER_ID FROM DUAL`;
    const orderSeqResult = await connection.execute(
      orderSeqQuery,
      {},
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const orderID = orderSeqResult.rows[0].ORDER_ID;

    // Insert order details and update stock
    for (const item of itemDetailsWithNames) {
      const { LotNo, ItemID, Quantity } = item;
      
      const insertOrderQuery = `
        INSERT INTO savla_order (
          order_id, customerid, order_date, item_id, quantity, lot_no
        ) VALUES (
          :OrderID, :CustomerID, SYSDATE, :ItemID, :Quantity, :LotNo
        )
      `;
      await connection.execute(
        insertOrderQuery,
        { OrderID: orderID, CustomerID, ItemID, Quantity, LotNo },
        { autoCommit: false }
      );

      const updateStockQuery = `
        UPDATE stock_lotno
        SET available_qty = available_qty - :Quantity
        WHERE fk_customer_id = :CustomerID
          AND fk_item_id = :ItemID
          AND lot_no = :LotNo
      `;
      await connection.execute(
        updateStockQuery,
        { Quantity, CustomerID, ItemID, LotNo },
        { autoCommit: false }
      );
    }

    // Send notifications
    const customerInfo = {
      email: EMAIL,
      name: DISP_NAME,
      phone: MOBILE_NO
    };

    try {
      const notificationResults = await notificationService.sendOrderConfirmations(
        {
          orderID,
          items: itemDetailsWithNames
        },
        customerInfo
      );
      console.log('Notification results:', notificationResults);
    } catch (notificationError) {
      console.error('Error sending notifications:', notificationError);
      // Continue processing even if notifications fail
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Order placed successfully and notifications sent",
      orderID,
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error processing order:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
},
 
async getOrderHistory(req, res) {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.execute('ALTER SESSION SET NLS_DATE_FORMAT = \'YYYY-MM-DD HH24:MI:SS\'');
 
    const orderHistoryQuery = `
      SELECT
        o.ORDER_ID,
        o.LOT_NO,
        o.ITEM_ID,
        o.QUANTITY,
        TO_CHAR(o.ORDER_DATE, 'YYYY-MM-DD HH24:MI:SS') as ORDER_DATE,
        im.ITEM_NAME
      FROM SYSTEM.savla_order o
      JOIN SYSTEM.ITEM_MASTER im ON o.ITEM_ID = im.ITEM_ID
      ORDER BY o.ORDER_DATE DESC
    `;
 
    const result = await connection.execute(orderHistoryQuery, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
 
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No orders found'
      });
    }
 
    res.status(200).json({
      success: true,
      data: result.rows
    });
 
  } catch (error) {
    console.error('Error in getOrderHistory:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
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
}
};
 
module.exports = authController;
 
 