import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import InwardsScreen from './assets/InwardsScreen';
import ExpiringProductsScreen from './ExtraScreens/ExpiringProductsScreen';
import InvoicesScreen from './ExtraScreens/InvoicesScreen';
import OrderPlacementScreen from './ExtraScreens/OrderPlacementScreen';
import OutwardsScreen from './ExtraScreens/OutwardsScreen';
import ProductSearchScreen from './ExtraScreens/ProductSearchScreen';
import BottomTabNavigator from './Frontend/Screens/BottomTabs/BottomTabNavigator';
import CartScreen from './Frontend/Screens/CartScreen';
import Category from './Frontend/Screens/Category';
import { CartProvider } from './Frontend/Screens/contexts/CartContext';
import { CustomerProvider } from './Frontend/Screens/contexts/CustomerContext';
import { NotificationProvider } from './Frontend/Screens/contexts/NotificationContext';
import LotReportScreen from './Frontend/Screens/LotReportScreen';
import OtpVerification from './Frontend/Screens/OtpVerificationScreen';
import SplashScreen from './Frontend/Screens/SplashScreen';
import StocksScreen from './Frontend/Screens/StocksScreen';

  
type RootStackParamList = {
  SplashScreen: undefined;
  OtpVerificationScreen: undefined;
  Main: undefined;
};

type MainStackParamList = {
  BottomTabs: undefined;
  Stocks: undefined;
  Inwards: undefined;
  Outwards: undefined;
  ExpiringProducts: undefined;
  Invoices: undefined;
  ProductSearch: undefined;
  OrderPlacement: undefined;
  Category: undefined;
  CartScreen: undefined;
  LotReportScreen: { item: any };
};

const RootStack = createStackNavigator<RootStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();

const MainStackNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="BottomTabs" component={BottomTabNavigator} />
    <MainStack.Screen name="Stocks" component={StocksScreen} />         
    <MainStack.Screen name="Inwards" component={InwardsScreen} />
    <MainStack.Screen name="Outwards" component={OutwardsScreen} />
    <MainStack.Screen name="ExpiringProducts" component={ExpiringProductsScreen} />
    <MainStack.Screen name="Invoices" component={InvoicesScreen} />
    <MainStack.Screen name="ProductSearch" component={ProductSearchScreen} />
    <MainStack.Screen name="OrderPlacement" component={OrderPlacementScreen} />
    {/* <MainStack.Screen
      name="CategoryStock"
      component={CategoryStockScreen}
      options={({ route }) => ({ title: route.params.category })}
    />       */}
    <MainStack.Screen name="Category" component={Category}options={{headerShown: true}}/>
    <MainStack.Screen name="CartScreen" component={CartScreen} />
    <MainStack.Screen name="LotReportScreen" component={LotReportScreen} />            
  </MainStack.Navigator>
);

export default function App() {
  return (
    <CustomerProvider>
      <CartProvider>
        <NotificationProvider>
          <NavigationContainer>
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="SplashScreen" component={SplashScreen} />
            <RootStack.Screen name="OtpVerificationScreen" component={OtpVerification} />
            <RootStack.Screen name="Main" component={MainStackNavigator} />
              {/* Add other screens as needed */}
            </RootStack.Navigator>
          </NavigationContainer>
        </NotificationProvider>
      </CartProvider>
    </CustomerProvider>
  );
}