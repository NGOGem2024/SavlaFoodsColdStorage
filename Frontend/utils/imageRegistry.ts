
import { Image, Platform } from 'react-native';
import {CATEGORY_IMAGE_PATHS,SUBCATEGORY_IMAGE_PATHS} from './imagePaths';

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
  parentCategoryId?: string;
}

export interface ImageResponse {
  categories: ImageMapping[];
  subcategories: ImageMapping[];
}

class ImageRegistry {
  private static instance: ImageRegistry;
  private categoryImageCache: Map<string, any> = new Map();
  private subcategoryImageCache: Map<string, any> = new Map();
  private imageLoadPromises: Map<string, Promise<any>> = new Map();

  private constructor() {
    // Populate caches
    Object.entries(CATEGORY_IMAGE_PATHS).forEach(([key, value]) => {
      this.categoryImageCache.set(key, { type: 'local', source: value });
    });

    Object.entries(SUBCATEGORY_IMAGE_PATHS).forEach(([key, value]) => {
      this.subcategoryImageCache.set(key, { type: 'local', source: value });
    });
  }

  private async prefetchImage(imageSource: any): Promise<boolean> {
    try {
      if (Platform.OS === 'web') return true;

      // Handle local images
      if (typeof imageSource === 'number') {
        const resolvedSource = Image.resolveAssetSource(imageSource);
        return await Image.prefetch(resolvedSource.uri);
      }

      return false;
    } catch (error) {
      console.warn('Error prefetching image:', error);
      return false;
    }
  }

  public static getInstance(): ImageRegistry {
    if (!ImageRegistry.instance) {
      ImageRegistry.instance = new ImageRegistry();
    }
    return ImageRegistry.instance;
  }

  public getCategoryImage(categoryId: string): any {
    const key = `C${categoryId}`;
    const cachedImage = this.categoryImageCache.get(key);
    
    if (cachedImage) {
      if (cachedImage.type === 'local') {
        this.prefetchImage(cachedImage.source).catch(console.warn);
        return cachedImage.source;
      }
    }
    
    return null; // This is the problem
  }

  public getSubcategoryImage(subcategoryId: string): any {
    const key = `SC${subcategoryId}`;
    const cachedImage = this.subcategoryImageCache.get(key);
    
    if (cachedImage) {
      if (cachedImage.type === 'local') {
        this.prefetchImage(cachedImage.source).catch(console.warn);
        return cachedImage.source;
      }
    }
    
    return null; // Return null instead of default image
  }


  public getLocalImageMappings(): ImageResponse {
    // Only include categories that exist in the cache
    const categories: ImageMapping[] = Array.from(this.categoryImageCache.entries())
      .filter(([key, value]) => value !== null && value.type === 'local') 
      .map(([key, value]) => ({
        id: key.replace('C', ''),
        imageUrl: `../../assets/images/categories/${key}.jpg`
      }));

    const subcategories: ImageMapping[] = Array.from(this.subcategoryImageCache.entries())
      .map(([key, value]) => ({
        id: key.replace('SC', ''),
        imageUrl: `../../assets/images/subcategories/${key}.jpg`
      }));

    return { categories, subcategories };
  }
}

// Export functions 
export const fetchImageMappings = async (): Promise<ImageResponse> => {
  try {
    // Get local image mappings from the registry
    const mappings = ImageRegistry.getInstance().getLocalImageMappings();
    return mappings;
  } catch (error) {
    console.error('Error getting image mappings:', error);
    return { categories: [], subcategories: [] };
  }
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

// export const formatCategories = (categories: any[]): CategoryImage[] => {
//   return categories.map(category => ({
//     id: category.CATID,
//     code: category.CATCODE,
//     description: category.CATDESC,
//     imageUrl: formatImageName(category.CATID, true)
//   }));
// };

// export const formatSubCategories = (subcategories: any[]): SubCategoryImage[] => {
//   return subcategories.map(subcategory => ({
//     id: subcategory.SUBCATID,
//     code: subcategory.SUBCATCODE,
//     description: subcategory.SUBCATDESC,
//     imageUrl: formatImageName(subcategory.SUBCATID, false),
//     parentCategoryId: subcategory.CATID
//   }));
// };
 

export const formatCategories = (categories: any[]): CategoryImage[] => {
  return categories
    .map(category => {
      const image = ImageRegistry.getInstance().getCategoryImage(category.CATID);
      if (!image) return null; // Skip categories without images
      
      return {
        id: category.CATID,
        code: category.CATCODE,
        description: category.CATDESC,
        imageUrl: formatImageName(category.CATID, true)
      };
    })
    .filter((category): category is CategoryImage => category !== null); // Type guard to remove null values
};

export const formatSubCategories = (subcategories: any[]): SubCategoryImage[] => {
  return subcategories
    .map((subcategory) => {
      try {
        // Get the image and check if it exists
        const imageRegistry = ImageRegistry.getInstance();
        const image = imageRegistry.getSubcategoryImage(subcategory.SUBCATID);
        
        // If no image is found, skip this subcategory
        if (!image) {
          console.log(`No image found for subcategory ${subcategory.SUBCATID}`);
          return null;
        }

        // If image exists, return the formatted subcategory
        const formattedSubCategory: SubCategoryImage = {
          id: subcategory.SUBCATID,
          code: subcategory.SUBCATCODE,
          description: subcategory.SUBCATDESC,
          imageUrl: formatImageName(subcategory.SUBCATID, false),
          parentCategoryId: subcategory.CATID
        };

        return formattedSubCategory;
      } catch (error) {
        console.error(`Error formatting subcategory ${subcategory.SUBCATID}:`, error);
        return null;
      }
    })
    .filter((subcategory): subcategory is SubCategoryImage => subcategory !== null);
};
