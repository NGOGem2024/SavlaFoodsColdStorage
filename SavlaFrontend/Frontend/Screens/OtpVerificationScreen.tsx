// import React, { useState } from 'react';
// import { Alert, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../../firebaseconfig';
// import { RootStackParamList } from '../type/types';
// import { MaterialIcons } from '@expo/vector-icons';

// type OtpVerificationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OtpVerificationScreen'>;

// const OtpVerification: React.FC = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const navigation = useNavigation<OtpVerificationScreenNavigationProp>();

//   const loginWithEmailAndPassword = async () => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       Alert.alert('Success', 'Logged in successfully');
//       navigation.navigate('Main');
//     } catch (err) {
//       if (err instanceof Error && err.message.includes('auth/user-not-found')) {
//         try {
//           await createUserWithEmailAndPassword(auth, email, password);
//           Alert.alert('Success', 'Account created and logged in successfully');
//           navigation.navigate('HomeScreen');
//         } catch (createErr) {
//           Alert.alert('Error', 'Failed to create an account: ');
//         }
//       } else {
//         Alert.alert('Error', 'Login failed: ' + (err instanceof Error ? err.message : String(err)));
//       }
//     }
//   };

//   const handleRegister = () => {
//     // Navigate to registration screen or show registration form
//     Alert.alert('Register', 'Navigate to registration screen');
//   };

//   return (
//     <View style={styles.container}>
//       <ImageBackground
//         source={require('../../assets/wish/bgimg.png')}
//         style={styles.background}
//         resizeMode="cover"
//       >
//         <ScrollView contentContainerStyle={styles.scrollViewContent}>
//           <View style={styles.header}>
//             <Image
//               source={require('../../assets/New folder/SavlaLogo.png')}
//               style={styles.logo}
//             />
//             <Text style={styles.title}>Unicorp Enterprises</Text>
//             <Text style={styles.subtitle}>Sign in with your email</Text>
//           </View>

//           <View style={styles.formContainer}>
//             <View style={styles.inputContainer}>
//               <MaterialIcons name="person" size={24} color="#999" style={styles.icon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Username"
//                 value={name}
//                 onChangeText={setName}
//                 placeholderTextColor="#999"
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <MaterialIcons name="email" size={24} color="#999" style={styles.icon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Email"
//                 value={email}
//                 onChangeText={setEmail}
//                 keyboardType="email-address"
//                 autoComplete="email"
//                 placeholderTextColor="#999"
//               />
//             </View>
//             <View style={styles.inputContainer}>

//               <MaterialIcons name="lock" size={24} color="#999" style={styles.icon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Password"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={true}
//                 placeholderTextColor="#999"
//               />
//             </View>
//             <TouchableOpacity style={styles.button} onPress={loginWithEmailAndPassword}>
//               <Text style={styles.buttonText}>Login with Email</Text>
//             </TouchableOpacity>

//             <Text style={styles.reg}>New User?</Text>
//             <TouchableOpacity onPress={handleRegister}>
//               <Text style={styles.registerLink}>Register here</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </ImageBackground>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   input: {
//     flex:1 ,
//     height: "100%",
//    fontSize: 16,
    
//   },
//   background: {
//     flex: 1,
//   },
//   icon: {
//   marginTop:10,
//     marginRight: 10,
//   },
//   scrollViewContent: {
//     flexGrow: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     paddingBottom: 20,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 30,
//     paddingTop: 80,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     marginTop: 90,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#473c3c',
//     marginTop: 25,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#6b6464',
//     marginTop: 8,
//   },
//   formContainer: {
//     width: '90%',
//     borderRadius: 20,
//     padding: 20,
//     alignItems: 'center',
//   },
//   inputContainer: {
//     width: '100%',
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#fff',
//     marginBottom: 15,
//     paddingHorizontal: 15,
//     shadowColor: '#fb932c',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     flexDirection:'row'
//   },
//   button: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#F48221',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 25,
//     marginTop: 10,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: '600',
//   },
//   reg: {
//     marginTop: 20,
//     fontSize: 16,
//   },
//   registerLink: {
//     color: '#F48221',
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 5,
//     textDecorationLine: 'underline',//   },
// });

// export default OtpVerification;
// import { MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import React, { useState } from 'react';
// import { Alert, Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { RootStackParamList } from '../type/types';

// type OtpVerificationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

// const OtpVerification: React.FC = () => {
//   const [name, setName] = useState('');
//   const [password, setPassword] = useState('');
//   const navigation = useNavigation<OtpVerificationScreenNavigationProp>();

//   const loginWithUsernameAndPassword = () => {
//     if (name === 'UCP' && password === 'UCP') {
//       Alert.alert('Success', 'Logged in successfully');
//       navigation.navigate('Main');
//     } else {
//       Alert.alert('Error', 'Invalid username or password');
//     }
//   };

//   const handleRegister = () => {
//     Alert.alert('Register', 'Navigate to registration screen');
//   };

//   return (
//     <View style={styles.container}>
//       <ImageBackground
//         source={require('../../assets/wish/bgimg.png')}
//         style={styles.background}
//         resizeMode="cover"
//       >
//         <ScrollView contentContainerStyle={styles.scrollViewContent}>
//           <View style={styles.header}>
//             <Image
//               source={require('../../assets/New folder/SavlaLogo.png')}
//               style={styles.logo}
//             />
//             <Text style={styles.title}>Unicorp Enterprises</Text>
//             <Text style={styles.subtitle}>Sign in with your credentials</Text>
//           </View>

//           <View style={styles.formContainer}>
//             <View style={styles.inputContainer}>
//               <MaterialIcons name="person" size={24} color="#999" style={styles.icon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Username"
//                 value={name}
//                 onChangeText={setName}
//                 placeholderTextColor="#999"
//               />
//             </View>

//             <View style={styles.inputContainer}>
//               <MaterialIcons name="lock" size={24} color="#999" style={styles.icon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Password"
//                 value={password}
//                 onChangeText={setPassword}
//                 secureTextEntry={true}
//                 placeholderTextColor="#999"
//               />
//             </View>

//             <TouchableOpacity style={styles.button} onPress={loginWithUsernameAndPassword}>
//               <Text style={styles.buttonText}>Login</Text>
//             </TouchableOpacity>

//             <Text style={styles.reg}>New User?</Text>
//             <TouchableOpacity onPress={handleRegister}>
//               <Text style={styles.registerLink}>Register here</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </ImageBackground>
//     </View>
//   );
// };

//Integration
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios'; // Make sure to install axios: npm install axios
import React, { useState } from 'react';
import { Alert, Image, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../type/types';

type OtpVerificationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HomeScreen'>;

const OtpVerification: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<OtpVerificationScreenNavigationProp>();

  const loginWithUsernameAndPassword = async () => {
    try {
      const response = await axios.post('http://192.168.1.3:3000/sf/getUserAccountID', {
        sf_userName: username,
        sf_userPwd: password
      });

      if (response.data && response.data.output) {
        // Store the token
        await AsyncStorage.setItem('userToken', response.data.output.token);
        await AsyncStorage.setItem('customerID', response.data.output.CustomerID.toString());
        await AsyncStorage.setItem('displayName', response.data.output.DisplayName);

        // Configure axios defaults for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.output.token}`;

        Alert.alert('Success', `Welcome ${response.data.output.DisplayName}!`);
        navigation.navigate('Main');
      } else {
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert('Error', error.response.data.message || 'An error occurred');
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    }
  };


  const handleRegister = () => {
    Alert.alert('Register', 'Navigate to registration screen');
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
  
  // Add an axios interceptor to handle token expiration
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Token expired or invalid
        await AsyncStorage.clear();
        // Navigate to login screen
        // You'll need to implement this navigation logic
      }
      return Promise.reject(error);
    }
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/wish/bgimg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <Image
              source={require('../../assets/New folder/SavlaLogo.png')}
              style={styles.logo}
            />
            <Text style={styles.title}>Unicorp Enterprises</Text>
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
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={loginWithUsernameAndPassword}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.reg}>New User?</Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={styles.registerLink}>Register here</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
  },
  background: {
    flex: 1,
  },
  icon: {
    marginTop: 10,
    marginRight: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 80,
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: 90,
  },
  title: {
    fontSize: 28,
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  reg: {
    marginTop: 20,
    fontSize: 16,
  },
  registerLink: {
    color: '#F48221',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
});

export default OtpVerification;

