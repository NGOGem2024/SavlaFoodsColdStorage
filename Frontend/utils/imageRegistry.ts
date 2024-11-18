
import { Image, Platform } from 'react-native';

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
    // Initialize category images
    const categoryImages = {
      'C1': require('../../assets/images/categories/C1.jpg'),
      'C6': require('../../assets/images/categories/C6.jpg'),
      'C7': require('../../assets/images/categories/C7.jpg'),
      'C10': require('../../assets/images/categories/C10.jpg'),
      'C12': require('../../assets/images/categories/C12.jpg'),
    };

    // Initialize subcategory images
    const subcategoryImages = {
      'SC1': require('../../assets/images/subcategories/SC1.jpg'),
      'SC2': require('../../assets/images/subcategories/SC2.jpg'),
      'SC4': require('../../assets/images/subcategories/SC4.jpg'),
      'SC5': require('../../assets/images/subcategories/SC5.jpg'),
      'SC6': require('../../assets/images/subcategories/SC6.jpg'),
      'SC7': require('../../assets/images/subcategories/SC7.jpg'),
      'SC8': require('../../assets/images/subcategories/SC8.jpg'),
      'SC11': require('../../assets/images/subcategories/SC11.jpg'),
      'SC13': require('../../assets/images/subcategories/SC13.jpg'),
      'SC14': require('../../assets/images/subcategories/SC14.jpg'),
      'SC20': require('../../assets/images/subcategories/SC20.jpg'),
      'SC21': require('../../assets/images/subcategories/SC21.jpg'),
      'SC22': require('../../assets/images/subcategories/SC22.jpg'),
      'SC23': require('../../assets/images/subcategories/SC23.jpg'),
      'SC26': require('../../assets/images/subcategories/SC26.jpg'),
      'SC27': require('../../assets/images/subcategories/SC27.jpg'),
      'SC29': require('../../assets/images/subcategories/SC29.jpg'),
      'SC31': require('../../assets/images/subcategories/SC31.jpg'),
      'SC32': require('../../assets/images/subcategories/SC32.jpg'),
      'SC35': require('../../assets/images/subcategories/SC35.jpg'),

    };

    // Populate caches
    Object.entries(categoryImages).forEach(([key, value]) => {
      this.categoryImageCache.set(key, { type: 'local', source: value });
    });

    Object.entries(subcategoryImages).forEach(([key, value]) => {
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
    
    return require('../../assets/images/default.jpg');
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
    
    return require('../../assets/images/default.jpg');
  }

  public getLocalImageMappings(): ImageResponse {
    const categories: ImageMapping[] = Array.from(this.categoryImageCache.entries())
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
    imageUrl: formatImageName(subcategory.SUBCATID, false),
    parentCategoryId: subcategory.CATID
  }));
};
 