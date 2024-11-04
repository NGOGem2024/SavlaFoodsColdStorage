import React, { useEffect } from 'react';
import { View, Image, StyleSheet ,Text} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
 import { RootStackParamList } from '../type/types';

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Use useEffect to set a timer for auto-navigation after a few seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('OtpVerificationScreen');
       
    }, 3000);           
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/New folder/SavlaLogo.png')} // Adjust the path based on your project structure
        style={styles.logo}
        resizeMode="contain" // Ensures the image fits within the container
      />
      <Text style={styles.text}>Savla Foods and Cold Storage</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Optional: set background color
  },
  logo: {
    width: 250,  // Width of the image
    height: 250, // Height of the image
    marginTop:-20
  },
  text:{
     fontSize:18,
     fontFamily: 'Roboto',
     fontWeight: 'bold',
     marginTop:10
  }
});

export default SplashScreen;