// // imagePathConfig.ts
// const fs = require('fs');
// const path = require('path');

// interface ImagePaths {
//   categories: { [key: string]: string };
//   subcategories: { [key: string]: string };
//   default: string;
// }

// interface PathConfig {
//   basePaths: {
//     assets: string;
//     images: string;
//     categories: string;
//     subcategories: string;
//   };
//   defaultImage: string;
// }

// class PathConfigGenerator {
//   private static instance: PathConfigGenerator;
//   private config: PathConfig = {
//     basePaths: {
//       assets: '../../assets',
//       images: '../../assets/images',
//       categories: '../../assets/images/categories',
//       subcategories: '../../assets/images/subcategories'
//     },
//     defaultImage: '../../assets/images/default.jpg'
//   };

//   private constructor() {}

//   public static getInstance(): PathConfigGenerator {
//     if (!PathConfigGenerator.instance) {
//       PathConfigGenerator.instance = new PathConfigGenerator();
//     }
//     return PathConfigGenerator.instance;
//   }

//   private scanDirectory(dirPath: string, prefix: string): string[] {
//     try {
//       const fullPath = path.resolve(__dirname, dirPath);
//       if (!fs.existsSync(fullPath)) return [];

//       return fs.readdirSync(fullPath)
//         .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
//         .map(file => file.replace('.jpg', ''));
//     } catch (error) {
//       console.error(`Error scanning directory ${dirPath}:`, error);
//       return [];
//     }
//   }

//   public generateImagePaths(): ImagePaths {
//     const categoryIds = this.scanDirectory(this.config.basePaths.categories, 'C');
//     const subcategoryIds = this.scanDirectory(this.config.basePaths.subcategories, 'SC');

//     const categories: { [key: string]: string } = {};
//     const subcategories: { [key: string]: string } = {};

//     categoryIds.forEach(id => {
//       categories[id] = `${this.config.basePaths.categories}/${id}.jpg`;
//     });

//     subcategoryIds.forEach(id => {
//       subcategories[id] = `${this.config.basePaths.subcategories}/${id}.jpg`;
//     });

//     return {
//       categories,
//       subcategories,
//       default: this.config.defaultImage
//     };
//   }

//   public generatePathConfigFile(): string {
//     const paths = this.generateImagePaths();
    
//     const configContent = `// Auto-generated path configuration
// module.exports = {
//   imagePaths: {
//     categories: ${JSON.stringify(paths.categories, null, 2)},
//     subcategories: ${JSON.stringify(paths.subcategories, null, 2)},
//     default: "${paths.default}"
//   },

//   getImagePath: function(id, isCategory = true) {
//     const collection = isCategory ? this.imagePaths.categories : this.imagePaths.subcategories;
//     const key = isCategory ? \`C\${id}\` : \`SC\${id}\`;
//     return collection[key] || this.imagePaths.default;
//   }
// };
// `;

//     const outputPath = path.resolve(__dirname, 'generatedImagePaths.js');
//     fs.writeFileSync(outputPath, configContent, 'utf-8');
    
//     return outputPath;
//   }
// }

// const generatePaths = () => {
//   return PathConfigGenerator.getInstance().generatePathConfigFile();
// };

// // Run if called directly
// if (require.main === module) {
//   generatePaths();
// }

// module.exports = { generatePaths };