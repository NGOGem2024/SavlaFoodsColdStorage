// generateImageLoader.js
const fs = require('fs');
const path = require('path');

const imagesDir = path.resolve(__dirname, 'assets/images');
const outputFilePath = path.resolve(__dirname, 'Frontend/utils/imageLoader.js');

const generateImageMap = (dir) => {
  const files = fs.readdirSync(dir);
  const imports = files
    .filter(file => /\.(jpg|jpeg|png|gif)$/.test(file)) // Ensure only image files are included
    .map(file => `'${file}': require('../../assets/images/${file}')`)
    .join(',\n  ');

  return `const images = {\n  ${imports}\n};\n\nexport const getImage = (imageName) => {\n  return images[imageName] || require('../../assets/images/default.jpg');\n};\n`;
};

const imageMapContent = generateImageMap(imagesDir);
fs.writeFileSync(outputFilePath, imageMapContent, 'utf-8');
console.log(`Image loader generated at ${outputFilePath}`);
