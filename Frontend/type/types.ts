import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
    CategoryStockScreen:undefined;
    ExpiringProducts:undefined;
    HomeScreen:undefined;
    Invoices:undefined;
    InwardsScreen:undefined;
    LoginScreen:undefined;
    OutwardScreen:undefined;
    StocksScreen:undefined;
    Checkout:undefined;
    OrderPlacementScreen:undefined;
    ProductSearchScreen:undefined;
    OtpVerificationScreen:undefined;
    Category:undefined;
    CartSCreen:undefined;
    LotReportScreen:{item : any};
    Announcement:undefined;
    BottomTabNavigator:undefined;
    Main:undefined;
    ItemDetailsExpanded:{
      ItemID:number;
    },
    ItemDetailScreen: {
      subcategoryId: string;
      subcategoryName: string;
      subcatImgFile: string;
    };
};

interface Item {
  ITEM_ID: number;
  ITEM_CODE: string;
  ITEM_NAME: string;
  DESCRIPTION: string;
  subcategoryId: string;
}

export interface CategoryImage {
  id: string;
  code: string;
  description: string;
  imageUrl: string;
}

export interface ImageMapping {
  id: string;
  imageUrl: string;
}

export interface ImageResponse {
  categories: ImageMapping[];
  subcategories: ImageMapping[];
}



export type RootStackNavProps<T extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, T>;
}; 