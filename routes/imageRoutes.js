// // const express = require('express');
// // const router = express.Router();
// // const oracledb = require('oracledb');
// // const dbConfig = require('../config/database'); // Your existing database config

// // router.get('/image-ids', async (req, res) => {
// //   let connection;
// //   try {
// //     connection = await oracledb.getConnection(dbConfig);

// //     // Get category IDs
// //     const categoryResult = await connection.execute(
// //       `SELECT ITEM_CATEG_ID FROM ITEMCAT_SUBCAT ORDER BY ITEM_CATEG_ID`
// //     );

// //     // Get subcategory IDs
// //     const subcategoryResult = await connection.execute(
// //       `SELECT ITEM_SUB_CATEGORY_ID FROM ITEMCAT_SUBCAT ORDER BY ITEM_SUB_CATEGORY_ID`
// //     );

// //     const imageIds = {
// //       categories: categoryResult.rows.map(row => row[0]),
// //       subcategories: subcategoryResult.rows.map(row => row[0])
// //     };

// //     res.json(imageIds);
// //   } catch (error) {
// //     console.error('Error fetching image IDs:', error);
// //     res.status(500).json({ error: 'Failed to fetch image IDs' });
// //   } finally {
// //     if (connection) {
// //       try {
// //         await connection.close();
// //       } catch (error) {
// //         console.error('Error closing connection:', error);
// //       }
// //     }
// //   }
// // });

// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { execute, oracledb } = require('../config/database');

// router.get('/image-ids', async (req, res) => {
//   try {
//     // Get category IDs
//     const categoryResult = await execute(
//       `SELECT ITEM_CATEG_ID FROM ITEMCAT_SUBCAT ORDER BY ITEM_CATEG_ID`
//     );

//     // Get subcategory IDs
//     const subcategoryResult = await execute(
//       `SELECT ITEM_SUB_CATEGORY_ID FROM ITEMCAT_SUBCAT ORDER BY ITEM_SUB_CATEGORY_ID`
//     );

//     const imageIds = {
//       categories: categoryResult.rows.map(row => row.ITEM_CATEG_ID),
//       subcategories: subcategoryResult.rows.map(row => row.ITEM_SUB_CATEGORY_ID)
//     };

//     res.json(imageIds);
//   } catch (error) {
//     console.error('Error fetching image IDs:', error);
//     res.status(500).json({ 
//       error: 'Failed to fetch image IDs',
//       details: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { execute } = require('../config/database');

// Helper function to format image IDs
const formatImageIds = (rows, prefix) => {
  return rows.map(row => ({
    id: row.ID,
    imageUrl: `${prefix}${row.ID}.jpg`
  }));
};

// Single endpoint that returns both categories and subcategories
router.get('/image-ids', async (req, res) => {
  try {
    // Get category IDs
    const categoryResult = await execute(`
      SELECT ITEM_CATEG_ID as ID 
      FROM ITEMCAT_SUBCAT 
      GROUP BY ITEM_CATEG_ID 
      ORDER BY ITEM_CATEG_ID
    `);

    // Get subcategory IDs
    const subcategoryResult = await execute(`
      SELECT ITEM_SUB_CATEGORY_ID as ID 
      FROM ITEMCAT_SUBCAT 
      ORDER BY ITEM_SUB_CATEGORY_ID
    `);

    const response = {
      categories: formatImageIds(categoryResult.rows, 'C'),
      subcategories: formatImageIds(subcategoryResult.rows, 'SC')
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching image IDs:', error);
    res.status(500).json({
      error: 'Failed to fetch image IDs',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Separate endpoints for categories and subcategories
router.get('/categories', async (req, res) => {
  try {
    const result = await execute(`
      SELECT ITEM_CATEG_ID as ID 
      FROM ITEMCAT_SUBCAT 
      GROUP BY ITEM_CATEG_ID 
      ORDER BY ITEM_CATEG_ID
    `);

    const categories = formatImageIds(result.rows, 'C');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      error: 'Failed to fetch categories',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.get('/subcategories', async (req, res) => {
  try {
    const result = await execute(`
      SELECT ITEM_SUB_CATEGORY_ID as ID 
      FROM ITEMCAT_SUBCAT 
      ORDER BY ITEM_SUB_CATEGORY_ID
    `);

    const subcategories = formatImageIds(result.rows, 'SC');
    res.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({
      error: 'Failed to fetch subcategories',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get subcategories for a specific category
router.get('/categories/:categoryId/subcategories', async (req, res) => {
  try {
    const result = await execute(`
      SELECT ITEM_SUB_CATEGORY_ID as ID 
      FROM ITEMCAT_SUBCAT 
      WHERE ITEM_CATEG_ID = :categoryId
      ORDER BY ITEM_SUB_CATEGORY_ID
    `, {
      categoryId: req.params.categoryId
    });

    const subcategories = formatImageIds(result.rows, 'SC');
    res.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories for category:', error);
    res.status(500).json({
      error: 'Failed to fetch subcategories',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;