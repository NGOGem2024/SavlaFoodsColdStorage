// // // utils/imageUtils.ts
// // import { ImageSourcePropType } from 'react-native';

// // // Define the image mapping type
// // type ImageMapping = {
// //   [key: string]: number;
// // };

// // // Import all category images
// // const categoryImages: ImageMapping = {
// //   'C1.jpg': require('../assets/images/categories/C1.jpg'),
// //   'C2.jpg': require('../assets/images/categories/C2.jpg'),
// //   'C3.jpg': require('../assets/images/categories/C3.jpg'),
// //   // Add all your category images here
// // };

// // // Import all subcategory images
// // const subcategoryImages: ImageMapping = {
// //   'SC1.jpg': require('../assets/images/subcategories/SC1.jpg'),
// //   'SC2.jpg': require('../assets/images/subcategories/SC2.jpg'),
// //   'SC3.jpg': require('../assets/images/subcategories/SC3.jpg'),
// //   // Add all your subcategory images here
// // };

// // export const getCategoryImage = (imageName: string): ImageSourcePropType => {
// //   const image = categoryImages[imageName];
// //   if (!image) {
// //     console.warn(`Category image not found: ${imageName}`);
// //     return require('../assets/images/placeholder.jpg'); // Provide a default placeholder image
// //   }
// //   return image;
// // };

// // export const getSubcategoryImage = (imageName: string): ImageSourcePropType => {
// //   const image = subcategoryImages[imageName];
// //   if (!image) {
// //     console.warn(`Subcategory image not found: ${imageName}`);
// //     return require('../assets/images/placeholder.jpg'); // Provide a default placeholder image
// //   }
// //   return image;
// // };

// // import { ImageSourcePropType } from 'react-native';

// // // Define the interface for API response
// // interface CategoryData {
// //   CATID: string;
// //   CATCODE: string;
// //   CATDESC: string;
// //   SUBCATID: string;
// //   SUBCATCODE: string;
// //   SUBCATDESC: string;
// //   categoryImage: string;
// //   subcategoryImage: string;
// // }

// // // Define the image mapping type
// // type ImageMapping = {
// //   [key: string]: number;
// // };

// // const DEFAULT_IMAGE = require('../../assets/images/default.jpg');

// // // Import all category images
// // const categoryImages: ImageMapping = {
// //   'C1.jpg': require('../../assets/images/categories/C1.jpg'),
// //   'C2.jpg': require('../../assets/images/categories/C6.jpg'),
// //   'C3.jpg': require('../../assets/images/categories/C7.jpg'),
// //   'C4.jpg': require('../../assets/images/categories/C10.jpg'),
// //   'C5.jpg': require('../../assets/images/categories/C12.jpg'),
// //   // Add more category images as needed
// // };

// // // Import all subcategory images
// // const subcategoryImages: ImageMapping = {
// //   'SC1.jpg': require('../../assets/images/subcategories/SC1.jpg'),
// //   'SC2.jpg': require('../../assets/images/subcategories/SC2.jpg'),
// //   'SC3.jpg': require('../../assets/images/subcategories/SC6.jpg'),
// //   'SC4.jpg': require('../../assets/images/subcategories/SC4.jpg'),
// //   'SC5.jpg': require('../../assets/images/subcategories/SC5.jpg'),
// //   // Add more subcategory images as needed
// // };

// // export const getCategoryImage = (imageName: string): ImageSourcePropType => {
// //   if (!imageName) {
// //     console.warn('No image name provided');
// //     return DEFAULT_IMAGE;
// //   }

// //   const image = categoryImages[imageName];
// //   if (!image) {
// //     console.warn(`Category image not found: ${imageName}`);
// //     return DEFAULT_IMAGE;
// //   }
// //   return image;
// // };

// // export const getSubcategoryImage = (imageName: string): ImageSourcePropType => {
// //   if (!imageName) {
// //     console.warn('No image name provided');
// //     return DEFAULT_IMAGE;
// //   }

// //   const image = subcategoryImages[imageName];
// //   if (!image) {
// //     console.warn(`Subcategory image not found: ${imageName}`);
// //     return DEFAULT_IMAGE;
// //   }
// //   return image;
// // };

// // export const validateImageExists = (imageName: string, type: 'category' | 'subcategory'): boolean => {
// //   const imageMap = type === 'category' ? categoryImages : subcategoryImages;
// //   return !!imageMap[imageName];
// // };


// // imageUtils.ts
// import axios from 'axios';

// const BACKEND_URL = "http://192.168.1.3:3000";

// export interface ImageMapping {
//     id: string;
//     imageUrl: string;
//   }
  
//   export const fetchImageMappings = async () => {
//     try {
//       const response = await axios.get(`${BACKEND_URL}/api/image-ids`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching image mappings:', error);
//       return { categories: [], subcategories: [] };
//     }
//   };
  
//   export const getCategoryImage = (categoryId: string) => {
//     try {
//       // First try to get the dynamic import
//       const imageMap: Record<string, any> = {
//         'C1.jpg': require('../../assets/images/categories/C1.jpg'),
//         'C6.jpg': require('../../assets/images/categories/C6.jpg'),
//         'C7.jpg': require('../../assets/images/categories/C7.jpg'),
//         'C10.jpg': require('../../assets/images/categories/C10.jpg'),
//         'C12.jpg': require('../../assets/images/categories/C12.jpg'),
//       };
      
//       return imageMap[categoryId] || require('../../assets/images/default.jpg');
//     } catch (error) {
//       console.error('Error loading category image:', error);
//       return require('../../assets/images/default.jpg');
//     }
//   };



// imageUtils.ts

// import axios from 'axios';

// const BACKEND_URL = "http://192.168.1.3:3000";

// export interface ImageMapping {
//   id: string;
//   imageUrl: string;
// }

// export interface CategoryImage {
//   id: string;
//   code: string;
//   description: string;
//   imageUrl: string;
// }


// export interface ImageResponse {
//   categories: ImageMapping[];
//   subcategories: ImageMapping[];
// }



// class ImageRegistry {
//   private static instance: ImageRegistry;
//   private categoryImages: Record<string, any> = {};
//   private subcategoryImages: Record<string, any> = {};

//   private constructor() {
//     // Initialize with known images
//     this.categoryImages = {
//       'C1.jpg': require('../../assets/images/categories/C1.jpg'),
//       'C6.jpg': require('../../assets/images/categories/C6.jpg'),
//       'C7.jpg': require('../../assets/images/categories/C7.jpg'),
//       'C10.jpg': require('../../assets/images/categories/C10.jpg'),
//       'C12.jpg': require('../../assets/images/categories/C12.jpg'),
//     };

//     this.subcategoryImages = {
//       'SC1.jpg': require('../../assets/images/subcategories/SC1.jpg'),
//       'SC2.jpg': require('../../assets/images/subcategories/SC2.jpg'),
//       'SC4.jpg': require('../../assets/images/subcategories/SC4.jpg'),
//       'SC5.jpg': require('../../assets/images/subcategories/SC5.jpg'),
//       'SC6.jpg': require('../../assets/images/subcategories/SC6.jpg'),
//     };
//   }

//   public static getInstance(): ImageRegistry {
//     if (!ImageRegistry.instance) {
//       ImageRegistry.instance = new ImageRegistry();
//     }
//     return ImageRegistry.instance;
//   }

//   public getCategoryImage(categoryId: string): any {
//     const imageName = `C${categoryId}.jpg`;
//     return this.categoryImages[imageName] || require('../../assets/images/default.jpg');
//   }

//   public getSubcategoryImage(subcategoryId: string): any {
//     const imageName = `SC${subcategoryId}.jpg`;
//     return this.subcategoryImages[imageName] || require('../../assets/images/default.jpg');
//   }
// }

// export const fetchImageMappings = async (): Promise<ImageResponse> => {
//   try {
//     const response = await axios.get(`${BACKEND_URL}/api/image-ids`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching image mappings:', error);
//     return { categories: [], subcategories: [] };
//   }
// };

// export const getCategoryImage = (categoryId: string): any => {
//   return ImageRegistry.getInstance().getCategoryImage(categoryId);
// };


// export const getSubcategoryImage = (subcategoryId: string, subcategories: ImageMapping[]): any => {
//     return ImageRegistry.getInstance().getSubcategoryImage(subcategoryId);
//   };

// export const formatImageName = (id: string, isCategory: boolean = true): string => {
//   const prefix = isCategory ? 'C' : 'SC';
//   return `${prefix}${id}.jpg`;
// };

// export const formatCategories = (categories: any[]): CategoryImage[] => {
//   return categories.map(category => ({
//     id: category.CATID,
//     code: category.CATCODE,
//     description: category.CATDESC,
//     imageUrl: formatImageName(category.CATID, true)
//   }));
// };
 

import axios from 'axios';

const BACKEND_URL = "http://192.168.1.3:3000";

export interface ImageMapping {
  id: string;
  imageUrl: string;
}

export interface CategoryImage {
  id: string;
  code: string;
  description: string;
  imageUrl: string;
}

export interface SubCategoryImage {
  id: string;
  code: string;
  description: string;
  imageUrl: string;
}

export interface ImageResponse {
  categories: ImageMapping[];
  subcategories: ImageMapping[];
}

class ImageRegistry {
  private static instance: ImageRegistry;
  private categoryImages: Record<string, any> = {};
  private subcategoryImages: Record<string, any> = {};

  private constructor() {
    // Initialize with known images
    this.categoryImages = {
      'C1.jpg': require('../../assets/images/categories/C1.jpg'),
      'C6.jpg': require('../../assets/images/categories/C6.jpg'),
      'C7.jpg': require('../../assets/images/categories/C7.jpg'),
      'C10.jpg': require('../../assets/images/categories/C10.jpg'),
      'C12.jpg': require('../../assets/images/categories/C12.jpg'),
    };

    this.subcategoryImages = {
      'SC1.jpg': require('../../assets/images/subcategories/SC1.jpg'),
      'SC2.jpg': require('../../assets/images/subcategories/SC2.jpg'),
      'SC4.jpg': require('../../assets/images/subcategories/SC4.jpg'),
      'SC5.jpg': require('../../assets/images/subcategories/SC5.jpg'),
      'SC6.jpg': require('../../assets/images/subcategories/SC6.jpg'),
      'SC7.jpg': require('../../assets/images/subcategories/SC7.jpg'),
      'SC8.jpg': require('../../assets/images/subcategories/SC8.jpg'),
      'SC11.jpg': require('../../assets/images/subcategories/SC11.jpg'),
      'SC13.jpg': require('../../assets/images/subcategories/SC13.jpg'),
      'SC14.jpg': require('../../assets/images/subcategories/SC14.jpg'),
      'SC20.jpg': require('../../assets/images/subcategories/SC20.jpg'),
      'SC21.jpg': require('../../assets/images/subcategories/SC21.jpg'),
      'SC22.jpg': require('../../assets/images/subcategories/SC22.jpg'),
      'SC23.jpg': require('../../assets/images/subcategories/SC23.jpg'),
      'SC26.jpg': require('../../assets/images/subcategories/SC26.jpg'),
      'SC27.jpg': require('../../assets/images/subcategories/SC27.jpg'),
      'SC29.jpg': require('../../assets/images/subcategories/SC29.jpg'),
      'SC31.jpg': require('../../assets/images/subcategories/SC31.jpg'),
      'SC32.jpg': require('../../assets/images/subcategories/SC32.jpg'),       
      'SC35.jpg': require('../../assets/images/subcategories/SC35.jpg'),      
    };
  }

  public static getInstance(): ImageRegistry {
    if (!ImageRegistry.instance) {
      ImageRegistry.instance = new ImageRegistry();
    }
    return ImageRegistry.instance;
  }

  public getCategoryImage(categoryId: string): any {
    const imageName = `C${categoryId}.jpg`;
    return this.categoryImages[imageName] || require('../../assets/images/default.jpg');
  }

  public getSubcategoryImage(subcategoryId: string): any {
    const imageName = `SC${subcategoryId}.jpg`;
    return this.subcategoryImages[imageName] || require('../../assets/images/default.jpg');
  }
  
  public registerSubcategoryImage(subcategoryId: string, imageUrl: string): void {
    const imageName = `SC${subcategoryId}.jpg`;
    this.subcategoryImages[imageName] = { uri: imageUrl };
  }
}

export const fetchImageMappings = async (): Promise<ImageResponse> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/image-ids`);
    if (response.data.subcategories) {
      response.data.subcategories.forEach((mapping: ImageMapping) => {
        ImageRegistry.getInstance().registerSubcategoryImage(mapping.id, mapping.imageUrl);
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching image mappings:', error);
    return { categories: [], subcategories: [] };
  }
  //   return response.data;
  // } catch (error) {
  //   console.error('Error fetching image mappings:', error);
  //   return { categories: [], subcategories: [] };
  // }
};

export const getCategoryImage = (categoryId: string): any => {
  return ImageRegistry.getInstance().getCategoryImage(categoryId);
};

export const getSubcategoryImage = (subcategoryId: string): any => {
  return ImageRegistry.getInstance().getSubcategoryImage(subcategoryId);
};
  
 

export const formatImageName = (id: string, isCategory: boolean = true): string => {
  const prefix = isCategory ? 'C' : 'SC';
  return `${prefix}${id}.jpg`;
};

export const formatCategories = (categories: any[]): CategoryImage[] => {
  return categories.map(category => ({
    id: category.CATID,
    code: category.CATCODE,
    description: category.CATDESC,
    imageUrl: formatImageName(category.CATID, true)
  }));
};

export const formatSubCategories = (subcategories: any[]): SubCategoryImage[] => {
  return subcategories.map(subcategory => ({
    id: subcategory.SUBCATID,
    code: subcategory.SUBCATCODE,
    description: subcategory.SUBCATDESC,
    imageUrl: formatImageName(subcategory.SUBCATID, true),
    parentCategoryId: subcategory.CATID
  }));
};