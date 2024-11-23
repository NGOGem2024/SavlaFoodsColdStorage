import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { RootStackParamList } from '../../App';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type OtpVerificationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

const OtpVerification: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<OtpVerificationScreenNavigationProp>();
  

 

  const loginWithUsernameAndPassword = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://192.168.0.102:3000/sf/getUserAccountID', {
        sf_userName: username,
        sf_userPwd: password
      });

      if (response.data && response.data.output) {
        const { token, CustomerID, DisplayName, CustomerGroupID } = response.data.output;
        
        // Store all necessary data
        await Promise.all([
          AsyncStorage.setItem('userToken', token),
          AsyncStorage.setItem('customerID', CustomerID.toString()),
          AsyncStorage.setItem('Disp_name', DisplayName),
          AsyncStorage.setItem('FK_CUST_GROUP_ID', CustomerGroupID.toString())
        ]);

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        navigation.navigate('Main', {
          screen: 'HomeScreen',
          params: {
            initialLogin: true,
            customerID: CustomerID.toString(),          
          }
        });
      } else {
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert('Error', error.response.data.message || 'An error occurred');
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };
  axios.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        await AsyncStorage.clear();
      }
      return Promise.reject(error);
    }
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../../assets/wish/bgimg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardAvoidView}
            keyboardVerticalOffset={Platform.OS === 'ios' ? -64 : 0}
          >
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.contentContainer}>
                <View style={styles.header}>
                  <Image
                    source={require('../../assets/New folder/SavlaLogo.png')}
                    style={styles.logo}
                  />
                  <Text style={styles.title}>LOGIN</Text>
                  <Text style={styles.subtitle}>Sign in with your credentials</Text>
                </View>

                <View style={styles.formContainer}>
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="person" size={24} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Username"
                      value={username}
                      onChangeText={setUsername}
                      placeholderTextColor="#999"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <MaterialIcons name="lock" size={24} color="#999" style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={true}
                      placeholderTextColor="#999"
                      autoCapitalize="none"
                    />
                  </View>

                  <TouchableOpacity 
                    style={[
                      styles.button, 
                      isLoading && styles.buttonLoading
                    ]} 
                    onPress={loginWithUsernameAndPassword}
                    activeOpacity={0.7}
                    disabled={isLoading}
                  >
                    <Text style={styles.buttonText}>
                      {isLoading ? 'Logging In...' : 'Login'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: SCREEN_HEIGHT,
    top: 0,
    left: 0,
  },
  keyboardAvoidView: {
    flex: 1,
    height: SCREEN_HEIGHT,
  },
  scrollViewContent: {
    flexGrow: 1,
    minHeight: SCREEN_HEIGHT,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 120,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#473c3c',
    marginTop: 25,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b6464',
    marginTop: 8,
  },
  formContainer: {
    width: '90%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  inputContainer: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    marginBottom: 15,
    paddingHorizontal: 15,
    shadowColor: '#fb932c',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  icon: {
    marginRight: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#F48221',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonLoading: {
    backgroundColor: '#C0C0C0', // Grayed-out color when loading
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OtpVerification;
