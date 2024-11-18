// // generateImageLoader.js
// const fs = require('fs');
// const path = require('path');

// const imagesDir = path.resolve(__dirname, 'assets/images');
// const outputFilePath = path.resolve(__dirname, 'Frontend/utils/imageLoader.js');

// const generateImageMap = (dir) => {
//   const files = fs.readdirSync(dir);
//   const imports = files
//     .filter(file => /\.(jpg|jpeg|png|gif)$/.test(file)) // Ensure only image files are included
//     .map(file => `'${file}': require('../../assets/images/${file}')`)
//     .join(',\n  ');

//   return `const images = {\n  ${imports}\n};\n\nexport const getImage = (imageName) => {\n  return images[imageName] || require('../../assets/images/default.jpg');\n};\n`;
// };

// const imageMapContent = generateImageMap(imagesDir);
// fs.writeFileSync(outputFilePath, imageMapContent, 'utf-8');
// console.log(`Image loader generated at ${outputFilePath}`);


 // frontend/generateImageLoader.js

 
 const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configure paths
const ASSETS_BASE = path.resolve(__dirname, 'assets');
const IMAGES_DIR = path.resolve(ASSETS_BASE, 'images');
const CATEGORIES_DIR = path.resolve(IMAGES_DIR, 'categories');
const SUBCATEGORIES_DIR = path.resolve(IMAGES_DIR, 'subcategories');
const OUTPUT_PATH = path.resolve(__dirname, 'Frontend/utils/imageLoader.js');

// Create necessary directories if they don't exist
function ensureDirectories() {
  [ASSETS_BASE, IMAGES_DIR, CATEGORIES_DIR, SUBCATEGORIES_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

// Function to fetch IDs from backend
async function getImageIds() {
  try {
    const response = await axios.get('http://192.168.1.3:3000/api/image-ids');
    const { categories, subcategories } = response.data;
    
    return {
      categoryImages: categories.map(id => `C${id}.jpg`),
      subcategoryImages: subcategories.map(id => `SC${id}.jpg`)
    };
  } catch (error) {
    console.error('Error fetching image IDs:', error);
    throw error;
  }
}

// Validate and process images in a directory
function processImagesInDirectory(dir, expectedImages) {
  const files = fs.readdirSync(dir);
  const validFiles = files.filter(file => {
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(file);
    const isExpected = expectedImages.includes(file);
    
    if (isImage && !isExpected) {
      console.warn(`Warning: Found image ${file} in ${path.basename(dir)} that doesn't match any database ID`);
    }
    
    return isImage && isExpected;
  });
  
  return validFiles;
}

// Generate the image loader code
function generateImageLoaderCode(categoryFiles, subcategoryFiles) {
  const categoryImports = categoryFiles
    .map(file => `'${file}': require('./images/categories/${file}')`)
    .join(',\n  ');
    
  const subcategoryImports = subcategoryFiles
    .map(file => `'${file}': require('./images/subcategories/${file}')`)
    .join(',\n  ');

  return `// Auto-generated image loader
const categoryImages = {
  ${categoryImports}
};

const subcategoryImages = {
  ${subcategoryImports}
};

export const getCategoryImage = (categoryId) => {
  const imageName = \`C\${categoryId}.jpg\`;
  return categoryImages[imageName] || require('./images/default.jpg');
};

export const getSubcategoryImage = (subcategoryId) => {
  const imageName = \`SC\${subcategoryId}.jpg\`;
  return subcategoryImages[imageName] || require('./images/default.jpg');
};

export const getAllCategoryImages = () => categoryImages;
export const getAllSubcategoryImages = () => subcategoryImages;
`;
}

async function main() {
  try {
    console.log('Starting image loader generation...');
    
    // Ensure all directories exist
    ensureDirectories();
    
    // Fetch expected image names
    const { categoryImages, subcategoryImages } = await getImageIds();
    
    // Process images in each directory
    const validCategoryFiles = processImagesInDirectory(CATEGORIES_DIR, categoryImages);
    const validSubcategoryFiles = processImagesInDirectory(SUBCATEGORIES_DIR, subcategoryImages);
    
    // Generate loader code
    const imageLoaderContent = generateImageLoaderCode(validCategoryFiles, validSubcategoryFiles);
    
    // Ensure output directory exists
    const outputDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(OUTPUT_PATH, imageLoaderContent, 'utf-8');
    console.log(`Image loader generated at ${OUTPUT_PATH}`);
    
    // Log summary
    console.log('\nSummary:');
    console.log(`- Found ${validCategoryFiles.length} valid category images`);
    console.log(`- Found ${validSubcategoryFiles.length} valid subcategory images`);
  } catch (error) {
    console.error('Failed to generate image loader:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}