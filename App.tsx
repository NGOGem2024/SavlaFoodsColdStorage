// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import React from 'react';
// import InwardsScreen from './assets/InwardsScreen';
// import ExpiringProductsScreen from './ExtraScreens/ExpiringProductsScreen';
// import InvoicesScreen from './ExtraScreens/InvoicesScreen';
// import OrderPlacementScreen from './ExtraScreens/OrderPlacementScreen';
// import OutwardsScreen from './ExtraScreens/OutwardsScreen';
// import ProductSearchScreen from './ExtraScreens/ProductSearchScreen';
// import BottomTabNavigator from './Frontend/Screens/BottomTabs/BottomTabNavigator';
// import CartScreen from './Frontend/Screens/CartScreen';
// import Category from './Frontend/Screens/Category';
// import { CartProvider } from './Frontend/Screens/contexts/CartContext';
// import { DisplayNameProvider } from './Frontend/Screens/contexts/DisplayNameContext';
// import { NotificationProvider } from './Frontend/Screens/contexts/NotificationContext';
// import ItemDetailScreen from './Frontend/Screens/ItemDetailScreen';
// import LotReportScreen from './Frontend/Screens/LotReportScreen';
// import OtpVerification from './Frontend/Screens/OtpVerificationScreen';
// import SplashScreen from './Frontend/Screens/SplashScreen';
// import StocksScreen from './Frontend/Screens/StocksScreen';

// type RootStackParamList = {
//   SplashScreen: undefined;
//   OtpVerificationScreen: undefined;
//   Main: undefined;
// };

// type MainStackParamList = {
//   BottomTabs: undefined;
//   Stocks: undefined;
//   Inwards: undefined;
//   Outwards: undefined;
//   ExpiringProducts: undefined;
//   Invoices: undefined;
//   ProductSearch: undefined;
//   OrderPlacement: undefined;
//   Category: undefined;
//   ItemDetailScreen: {
//     subcategoryId: string;
//     subcategoryName: string;
//     subcatImgFile: string;
//   };
//   CartScreen: undefined;
//   LotReportScreen: { item: any };
// };

// const RootStack = createStackNavigator<RootStackParamList>();
// const MainStack = createStackNavigator<MainStackParamList>();

// const MainStackNavigator = () => (
//   <MainStack.Navigator screenOptions={{ headerShown: false }}>
//     <MainStack.Screen name="BottomTabs" component={BottomTabNavigator} />
//     <MainStack.Screen name="Stocks" component={StocksScreen} />
//     <MainStack.Screen name="Inwards" component={InwardsScreen} />
//     <MainStack.Screen name="Outwards" component={OutwardsScreen} />
//     <MainStack.Screen name="ExpiringProducts" component={ExpiringProductsScreen} />
//     <MainStack.Screen name="Invoices" component={InvoicesScreen} />
//     <MainStack.Screen name="ProductSearch" component={ProductSearchScreen} />
//     <MainStack.Screen name="OrderPlacement" component={OrderPlacementScreen} />
//     {/* <MainStack.Screen
//       name="CategoryStock"
//       component={CategoryStockScreen}
//       options={({ route }) => ({ title: route.params.category })}
//     />       */}
//     <MainStack.Screen name="Category" component={Category}options={{headerShown: true}}/>
//     <MainStack.Screen name="ItemDetailScreen" component={ItemDetailScreen}options={{headerShown: true}}/>
//     <MainStack.Screen name="CartScreen" component={CartScreen} />
//     <MainStack.Screen name="LotReportScreen" component={LotReportScreen} />
//   </MainStack.Navigator>
// );

// export default function App() {
//   return (
//     <DisplayNameProvider>
//       <CartProvider>
//         <NotificationProvider>
//           <NavigationContainer>
//           <RootStack.Navigator screenOptions={{ headerShown: false }}>
//             <RootStack.Screen name="SplashScreen" component={SplashScreen} />
//             <RootStack.Screen name="OtpVerificationScreen" component={OtpVerification} />
//             <RootStack.Screen name="Main" component={MainStackNavigator} />
//               {/* Add other screens as needed */}
//             </RootStack.Navigator>
//           </NavigationContainer>
//         </NotificationProvider>
//       </CartProvider>
//     </DisplayNameProvider>
//   );
// }

import { NavigationContainer } from "@react-navigation/native";
import {
  createStackNavigator,
  StackScreenProps,
} from "@react-navigation/stack";
import React from "react";
import ExpiringProductsScreen from "./ExtraScreens/ExpiringProductsScreen";
import InvoicesScreen from "./ExtraScreens/InvoicesScreen";
import InwardsScreen from "./ExtraScreens/InwardsScreen";
import OrderPlacementScreen from "./ExtraScreens/OrderPlacementScreen";
import OutwardsScreen from "./ExtraScreens/OutwardsScreen";
import ProductSearchScreen from "./ExtraScreens/ProductSearchScreen";
import BottomTabNavigator from "./Frontend/Screens/BottomTabs/BottomTabNavigator";
// import CartScreen from "./Frontend/Screens/CartScreen";
import { CartProvider } from "./Frontend/Screens/contexts/CartContext";
import { DisplayNameProvider } from "./Frontend/Screens/contexts/DisplayNameContext";
import { NotificationProvider } from "./Frontend/Screens/contexts/NotificationContext";
import ItemDetailScreen from "./Frontend/Screens/ItemDetailScreen";
import ItemDetailsExpanded from "./Frontend/Screens/ItemDetailsExpanded";
import LotReportScreen from "./Frontend/Screens/LotReportScreen";
import OtpVerification from "./Frontend/Screens/OtpVerificationScreen";
import PlaceOrderScreen from "./Frontend/Screens/PlaceOrderScreen";
import QuantitySelectorModal from "./Frontend/Screens/QuantitySelectorModal";
import SplashScreen from "./Frontend/Screens/SplashScreen";
import StocksScreen from "./Frontend/Screens/StocksScreen";
import SubCategory from "./Frontend/Screens/SubCategory";
// import { Item } from './Frontend/type/types'
// import {CartItem} from '././Frontend/type/types'

// Define the type for route params
// export type RootStackParamList = {
//   SplashScreen: undefined;
//   OtpVerificationScreen: undefined;
//   Main: undefined;
//   CategoryStockScreen: undefined;
//   ExpiringProducts: undefined;
//   HomeScreen: {
//     switchedAccount?: boolean;
//     newCustomerId?: string;
//     timestamp?: number;
//   };
//   newCustomerId?: string;
//   Invoices: undefined;
//   InwardsScreen: undefined;
//   LoginScreen: undefined;
//   OutwardScreen: undefined;
//   StocksScreen: undefined;
//   Checkout: undefined;
//   OrderPlacementScreen: undefined;
//   ProductSearchScreen: undefined;
//   SubCategory:  { category: string; categoryId: string };
//   ItemDetailsExpanded:{ItemID: number, itemName:string};
//   CartScreen: undefined;
//   LotReportScreen: undefined;
//   Announcement: undefined;
//   BottomTabNavigator: undefined;
//   PlaceOrderScreen:undefined;
//   ItemDetailScreen: {
//     subcategoryId: string;
//     subcategoryName: string;
//     subcategoryImage: string;
//   };
// };

// const RootStack = createStackNavigator<RootStackParamList>();
// const MainStack = createStackNavigator<RootStackParamList>();

interface Item {
  ITEM_ID: number;
  ITEM_NAME: string;
  LOT_NO: string;
  ITEM_MARKS?: string;
  VAKAL_NO?: string;
  AVAILABLE_QTY: number;
  UNIT_NAME: string;
  quantity?: number;
}


export type RootStackParamList = {
  SplashScreen: undefined;
  OtpVerificationScreen: {
    customerID: number | string;
  };
  Main: {
    screen: string; // Screen name in the nested navigator
    params?: {
      initialLogin?: boolean;
      customerID?:  number | string;
    };
  };
  HomeScreen: {
    switchedAccount?: boolean;
    newCustomerId?:  number | string;
    timestamp?: number;
    initialLogin?: boolean;
    customerID?:  number | string;
  };
};
 
 
// Separate type for main stack params
export type MainStackParamList = {
  BottomTabNavigator: undefined;
  StocksScreen: undefined;
  InwardsScreen: undefined;
  OutwardScreen: undefined;
  ExpiringProducts: undefined;
  Invoices: undefined;
  ProductSearchScreen: undefined;
  OrderPlacementScreen: undefined;
  // PlaceOrderScreen: undefined;
  QuantitySelectorModal: { 
    item: {
      item_id: number;
      lot_no: string;
      available_qty: number;
      box_quantity: number;
      customerID?: number | string;       
      vakal_no?: string;
      item_marks?: string;
      box_quantity:number;
    };
  };
  PlaceOrderScreen: {
    selectedItems: Array<{
      ItemID: number;
      LotNo: string;
      Quantity: number;
<<<<<<< HEAD
      customerID:  number | string;
=======
      customerID?: number | string;
>>>>>>> 30e18c0fcd6fbb8dde0968d9c5e9358259bc5766
      item_name?: string;
      unit_name?: string;
      vakal_no?: string;
      item_marks?: string;
<<<<<<< HEAD
      box_quantity: number;
    }>;
    customerID:  number | string;
=======
      box_quantity:number;
      
    }[];
>>>>>>> 30e18c0fcd6fbb8dde0968d9c5e9358259bc5766
  };

  SubCategory: {
    category: string;
    categoryId: string;
    customerID: number | string;
    subcategoryImage:string;
  };
  ItemDetailScreen: {
    subcategoryId: string;
    subcategoryName: string;
    subcategoryImage: string;
    customerID: number | string;
  };
  ItemDetailsExpanded: {
    ItemID: number;
    itemName: string;
    customerID: number | string;
     
  };
  CartScreen: undefined;
  LotReportScreen: undefined;
  
};

// Create separate navigators with their specific param lists
const RootStack = createStackNavigator<RootStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();

// Type for props received by screens in the MainStack
export type MainStackScreenProps<T extends keyof MainStackParamList> =
  StackScreenProps<MainStackParamList, T>;

// Type for props received by screens in the RootStack
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

// const MainStackNavigator: React.FC = () => {
//   return (
//     <MainStack.Navigator>
//       <MainStack.Screen
//         name="BottomTabNavigator"
//         component={BottomTabNavigator}
//         options={{ headerShown: false }}
//       />
//       <MainStack.Screen name="StocksScreen" component={StocksScreen} />
//       <MainStack.Screen name="InwardsScreen" component={InwardsScreen} />
//       <MainStack.Screen name="OutwardScreen" component={OutwardsScreen} />
//       <MainStack.Screen name="ExpiringProducts" component={ExpiringProductsScreen} />
//       <MainStack.Screen name="Invoices" component={InvoicesScreen} />
//       <MainStack.Screen name="ProductSearchScreen" component={ProductSearchScreen} />
//       <MainStack.Screen name="OrderPlacementScreen" component={OrderPlacementScreen} />
//       <MainStack.Screen name="PlaceOrderScreen" component={PlaceOrderScreen} />
//       <MainStack.Screen name="SubCategory" component={SubCategory}
//       options={({route}) => ({
//         title:route.params.category
//       })}/>
//       <MainStack.Screen
//         name="ItemDetailScreen"
//         component={ItemDetailScreen}
//         options={({ route }) => ({
//           title: route.params.subcategoryName
//         })}
//       />
//       <MainStack.Screen
//         name="ItemDetailsExpanded"
//         component={ItemDetailsExpanded}
//         options={({ route}) => ({
//           title: route.params.itemName
//         })}
//       />
//       <MainStack.Screen name="CartScreen" component={CartScreen} />
//       <MainStack.Screen
//         name="LotReportScreen"
//         component={LotReportScreen}
//         options={{ title: 'Lot Report' }}
//       />
//     </MainStack.Navigator>
//   );
// };

// const App: React.FC = () => {
//   return (
//     <NavigationContainer>
//       <DisplayNameProvider>
//         <NotificationProvider>
//           <CartProvider>
//             <RootStack.Navigator initialRouteName="SplashScreen">
//               <RootStack.Screen
//                 name="SplashScreen"
//                 component={SplashScreen}
//                 options={{ headerShown: false }}
//               />
//               <RootStack.Screen
//                 name="OtpVerificationScreen"
//                 component={OtpVerification}
//                 options={{ headerShown: false }}
//               />
//               <RootStack.Screen
//                 name="Main"
//                 component={MainStackNavigator}
//                 options={{ headerShown: false }}
//               />
//             </RootStack.Navigator>
//           </CartProvider>
//         </NotificationProvider>
//       </DisplayNameProvider>
//     </NavigationContainer>
//   );
// };

const MainStackNavigator: React.FC = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <MainStack.Screen name="StocksScreen" component={StocksScreen} />
      <MainStack.Screen name="InwardsScreen" component={InwardsScreen} />
      <MainStack.Screen name="OutwardScreen" component={OutwardsScreen} />
      <MainStack.Screen
        name="ExpiringProducts"
        component={ExpiringProductsScreen}
      />
      <MainStack.Screen name="Invoices" component={InvoicesScreen} />
      <MainStack.Screen
        name="ProductSearchScreen"
        component={ProductSearchScreen}
      />
      <MainStack.Screen
        name="OrderPlacementScreen"
        component={OrderPlacementScreen}
      />
      <MainStack.Screen name="PlaceOrderScreen" component={PlaceOrderScreen}    options={({ route }) => ({
          title:"Place Order",
        })}/>
      <MainStack.Screen
        name="SubCategory"
        component={SubCategory}
        options={({ route }) => ({
          title: route.params.category,
        })}
      />
      <MainStack.Screen
        name="ItemDetailScreen"
        component={ItemDetailScreen}
        options={({ route }) => ({
          title: route.params.subcategoryName,
        })}
      />
      <MainStack.Screen
        name="ItemDetailsExpanded"
        component={ItemDetailsExpanded}
        options={({ route }) => ({
          title: route.params.itemName,
        })}
      />
      {/* <MainStack.Screen name="CartScreen" component={CartScreen} /> */}
      <MainStack.Screen
        name="LotReportScreen"
        component={LotReportScreen}
        options={{ title: "Lot Report" }}
      />
        <MainStack.Screen 
          name="QuantitySelectorModal" 
          component={QuantitySelectorModal} 
          options={{ 
            presentation: 'modal',
            title: 'Select Quantity' 
          }}
        />
    </MainStack.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <DisplayNameProvider>
        <NotificationProvider>
          <CartProvider>
            <RootStack.Navigator initialRouteName="SplashScreen">
              <RootStack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="OtpVerificationScreen"
                component={OtpVerification}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="Main"
                component={MainStackNavigator}
                options={{ headerShown: false }}
              />
              <RootStack.Screen
                name="HomeScreen"
                // component={HomeScreen}
                component={MainStackNavigator}
                options={{ headerShown: false }}
                // options={({ route }) => ({
                //   title: route.params.category,
                // })}
              />
            </RootStack.Navigator>
          </CartProvider>
        </NotificationProvider>
      </DisplayNameProvider>
    </NavigationContainer>
  );
};

export default App;
