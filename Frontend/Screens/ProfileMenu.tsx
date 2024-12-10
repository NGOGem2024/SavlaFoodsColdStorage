

// //integration & design
// import { MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Modal,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";
// import { RootStackParamList } from "../type/types";
// import { useDisplayName } from "./contexts/DisplayNameContext";

// const BACKEND_URL = "http://192.168.1.37:3000";

// interface ProfileMenuProps {
//   displayName: string | null;
//   onAccountSwitch?: () => void; 
// }

// interface CustomerGroup {
//   FK_CUSTOMER_ID: number;
//   DISP_NAME: string;
//   DEF: number;
//   FK_CUST_GROUP_ID: number;
// }

// interface AccountItem {
//   label: string;
//   value: string;
//   default?: boolean;
//   customerId: number;
//   groupId: number;
// }

// interface ListAccountsResponse {
//   input: {
//     FK_CUST_GROUP_ID: number;
//   };
//   output: {
//     count: number;
//     groups: CustomerGroup[];
//   };
// }

// const ProfileMenu: React.FC<ProfileMenuProps> = ({ displayName, onAccountSwitch  }) => {
//   const [showMenu, setShowMenu] = useState(false);
//   const [showSwitchModal, setShowSwitchModal] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [value, setValue] = useState<string | null>(null);
//   const [items, setItems] = useState<AccountItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const { setDisplayName } = useDisplayName();
//   const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

//   const fetchCustomerGroups = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const groupId = await AsyncStorage.getItem("FK_CUST_GROUP_ID");
//       if (!groupId) {
//         throw new Error("No customer group ID found");
//       }

//       const response = await axios.post<ListAccountsResponse>(
//         `${BACKEND_URL}/sf/listAccounts`,
//         { FK_CUST_GROUP_ID: parseInt(groupId) }
//       );

//       if (response.data.output.count === 0) {
//         setError("No customer groups found");
//         return;
//       }

//       const accountItems: AccountItem[] = response.data.output.groups.map(
//         (group) => ({
//           label: group.DISP_NAME,
//           value: group.DISP_NAME, // Using DISP_NAME as value for dropdown
//           customerId: group.FK_CUSTOMER_ID,
//           groupId: group.FK_CUST_GROUP_ID,
//           default: group.DEF === 1,
//         })
//       );

//       setItems(accountItems);

//       // Set default value if exists
//       const defaultAccount = accountItems.find((item) => item.default);
//       if (defaultAccount) {
//         setValue(defaultAccount.value);
//       }
//     } catch (error: any) {
//       console.error("Error fetching customer groups:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to fetch customer groups";
//       setError(errorMessage);

//       if (error.message === "No customer group ID found") {
//         handleLogout();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (showSwitchModal) {
//       fetchCustomerGroups();
//     }
//   }, [showSwitchModal]);

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.multiRemove([
//         "userToken",
//         "Disp_name",
//         "FK_CUST_GROUP_ID",
//         "customerID",
//       ]);
//       setShowMenu(false);
//       navigation.reset({
//         index: 0,
//         routes: [{ name: "OtpVerificationScreen" }],
//       });
//     } catch (error) {
//       console.error("Logout error:", error);
//       Alert.alert("Error", "Failed to logout. Please try again.");
//     }
//   };

//   const handleSwitchAccount = async () => {
//     if (!value) {
//       Alert.alert("Error", "Please select an account");
//       return;
//     }

//     try {
//       const selectedAccount = items.find((item) => item.value === value);
//       if (!selectedAccount) {
//         throw new Error("Invalid account selected");
//       }

//       await Promise.all([
//         AsyncStorage.setItem(
//           "customerID",
//           selectedAccount.customerId.toString()
//         ),
//         AsyncStorage.setItem("Disp_name", selectedAccount.label),
//         AsyncStorage.setItem(
//           "FK_CUST_GROUP_ID",
//           selectedAccount.groupId.toString()
//         ),
//       ]);

//        // Call the onAccountSwitch callback if provided
//        if (onAccountSwitch) {
//         onAccountSwitch();
//       }

//       setDisplayName(selectedAccount.label);
//       setShowSwitchModal(false);

//       navigation.reset({
//         index: 0,
//         routes: [
//           {
//             name: "HomeScreen",
//             params: {
//               switchedAccount: true,
//               newCustomerId: selectedAccount.customerId.toString(),
//               timestamp: Date.now() // Force refresh
//             }
//           }
//         ]
//       });
//     }  catch (error: any) {
//       console.error("Error switching account:", error);
//       Alert.alert("Error", error.message || "Failed to switch account");
//     }
//   };

//   return (
//     <>
//       <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
//         <MaterialIcons name="account-circle" size={28} color="#007BFA" />
//       </TouchableOpacity>

//       <Modal
//         visible={showMenu}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowMenu(false)}
//       >
//         <TouchableOpacity
//           style={styles.overlay}
//           activeOpacity={1}
//           onPress={() => setShowMenu(false)}
//         >
//           <View style={styles.menuContainer}>
//             <TouchableOpacity activeOpacity={1}>
//               <View style={styles.profileHeader}>
//                 <MaterialIcons name="account-circle" size={80} color="#007BFA" />
//                 <Text style={styles.displayName}>{displayName || "User"}</Text>
//                 <View style={styles.divider} />
//               </View>

//               <TouchableOpacity
//                 style={styles.menuItem}
//                 onPress={() => {
//                   setShowMenu(false);
//                   setShowSwitchModal(true);
//                 }}
//               >
//                 <MaterialIcons name="swap-horiz" size={24} color="#333" />
//                 <Text style={styles.menuText}>Switch Account</Text>
//                 <MaterialIcons name="chevron-right" size={24} color="#666" />
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
//                 <MaterialIcons name="logout" size={24} color="#333" />
//                 <Text style={styles.menuText}>Logout</Text>
//                 <MaterialIcons name="chevron-right" size={24} color="#666" />
//               </TouchableOpacity>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       <Modal
//         visible={showSwitchModal}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setShowSwitchModal(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Switch Account</Text>
//             {loading ? (
//               <ActivityIndicator size="large" color="#007BFA" />
//             ) : error ? (
//               <Text style={styles.errorText}>{error}</Text>
//             ) : (
//               <DropDownPicker
//                 open={open}
//                 value={value}
//                 items={items}
//                 setOpen={setOpen}
//                 setValue={setValue}
//                 setItems={setItems}
//                 placeholder="Select an account"
//                 style={styles.dropdown}
//                 dropDownContainerStyle={styles.dropdownContainer}
//                 containerStyle={{ marginBottom: 20 }}
//                 selectedItemContainerStyle={styles.selectedItemContainer}
//                 selectedItemLabelStyle={styles.selectedItemLabel}
//               />
//             )}
//             <TouchableOpacity
//               style={styles.switchButton}
//               onPress={handleSwitchAccount}
//               disabled={loading || !!error}
//             >
//               <Text style={styles.switchButtonText}>Switch</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.cancelButton}
//               onPress={() => setShowSwitchModal(false)}
//             >
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-start",
//     alignItems: "flex-end",
//   },
//   menuContainer: {
//     width: 250,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     padding: 20,
//     marginTop: 50,
//     marginRight: 10,
//     elevation: 5,
//   },
//   profileHeader: {
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   displayName: {
//     marginTop: 10,
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   divider: {
//     height: 1,
//     backgroundColor: "#ddd",
//     width: "100%",
//     marginVertical: 10,
//   },
//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//   },
//   menuText: {
//     flex: 1,
//     marginLeft: 10,
//     fontSize: 16,
//     color: "#333",
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },
//   modalContent: {
//     width: "80%",
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     padding: 20,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   errorText: {
//     color: "red",
//     marginBottom: 20,
//   },
//   dropdown: {
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//   },
//   dropdownContainer: {
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 8,
//   },
//   selectedItemContainer: {
//     backgroundColor: "#e6f7ff",
//   },
//   selectedItemLabel: {
//     color: "#007BFA",
//   },
//   switchButton: {
//     backgroundColor: "#007BFA",
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   switchButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   cancelButton: {
//     backgroundColor: "#ccc",
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   cancelButtonText: {
//     color: "#333",
//     fontSize: 16,
//   },
// });

// export default ProfileMenu;

 
// import { MaterialIcons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useNavigation } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Modal,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";
// import { RootStackParamList } from "../type/types";
// import { useDisplayName } from "./contexts/DisplayNameContext";
 
// const BACKEND_URL = "http://192.168.1.3:3000";
 
// interface ProfileMenuProps {
//   displayName: string | null;
//   onAccountSwitch?: () => void;
// }
 
// interface CustomerGroup {
//   FK_CUSTOMER_ID: number;
//   DISP_NAME: string;
//   DEF: number;
//   FK_CUST_GROUP_ID: number;
//   CUSTOMER_NAME: string;
// }
 
// interface AccountItem {
//   label: string;
//   value: string;
//   default?: boolean;
//   customerId: number;
//   groupId: number;
// }
 
// const ProfileMenu: React.FC<ProfileMenuProps> = ({ displayName, onAccountSwitch }) => {
//   const [showMenu, setShowMenu] = useState(false);
//   const [showSwitchModal, setShowSwitchModal] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [value, setValue] = useState<string | null>(null);
//   const [items, setItems] = useState<AccountItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [debugInfo, setDebugInfo] = useState<string | null>(null);
 
//   const { setDisplayName } = useDisplayName();
//   const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
 
//   const fetchCustomerGroups = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       setDebugInfo(null);
 
//       const groupId = await AsyncStorage.getItem("FK_CUST_GROUP_ID");
//       console.log('Stored FK_CUST_GROUP_ID:', groupId);
 
//       if (!groupId) {
//         throw new Error("No customer group ID found");
//       }
 
//       setDebugInfo(`Fetching accounts for group ID: ${groupId}`);
 
//       const response = await axios.post(
//         `${BACKEND_URL}/sf/listAccounts`,
//         { FK_CUST_GROUP_ID: parseInt(groupId) }
//       );
 
//       if (!response.data.output || response.data.output.count === 0) {
//         throw new Error("No customer groups found");
//       }
 
//       const accountItems: AccountItem[] = response.data.output.groups.map(
//         (group: { DISP_NAME: any; CUSTOMER_NAME: any; FK_CUSTOMER_ID: any; FK_CUST_GROUP_ID: any; DEF: number; }) => ({
//           label: `${group.DISP_NAME} (${group.CUSTOMER_NAME || 'Unknown'})`,
//           value: group.DISP_NAME,
//           customerId: group.FK_CUSTOMER_ID,
//           groupId: group.FK_CUST_GROUP_ID,
//           default: group.DEF === 1,
//         })
//       );
 
//       setItems(accountItems);
     
//       // Set initial value to current display name or default account
//       const currentAccount = accountItems.find(item => item.value === displayName)
//         || accountItems.find(item => item.default)
//         || accountItems[0];
       
//       if (currentAccount) {
//         setValue(currentAccount.value);
//       }
 
//     } catch (error: any) {
//       console.error("Error fetching customer groups:", error);
//       const errorMessage = error.response?.data?.message || error.message;
//       setError(errorMessage);
//       setDebugInfo(`Error: ${JSON.stringify(error.response?.data || error.message)}`);
 
//       if (error.message === "No customer group ID found") {
//         handleLogout();
//       }
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.multiRemove([
//         "token",
//         "FK_CUST_GROUP_ID",
//         "displayName",
//         "customerId"
//       ]);
//       navigation.reset({
//         index: 0,
//         routes: [{ name: "OtpVerificationScreen" }],
//       });
//     } catch (error) {
//       console.error("Error during logout:", error);
//       Alert.alert("Error", "Failed to logout. Please try again.");
//     }
//   };
 
//   const handleSwitchAccount = async () => {
//     if (!value) {
//       Alert.alert("Error", "Please select an account");
//       return;
//     }
 
//     try {
//       const selectedAccount = items.find(item => item.value === value);
//       if (!selectedAccount) {
//         throw new Error("Selected account not found");
//       }
 
//       // Store new account details
//       await AsyncStorage.multiSet([
//         ["displayName", value],
//         ["customerId", selectedAccount.customerId.toString()],
//       ]);
 
//       // Update context
//       setDisplayName(value);
     
//       // Close modals
//       setShowSwitchModal(false);
//       setShowMenu(false);
 
//       // Call parent callback if provided
//       if (onAccountSwitch) {
//         onAccountSwitch();
//       }
 
//       // Show success message
//       Alert.alert("Success", "Account switched successfully");
 
//     } catch (error) {
//       console.error("Error switching account:", error);
//       Alert.alert("Error", "Failed to switch account. Please try again.");
//     }
//   };
 
//   useEffect(() => {
//     if (showSwitchModal) {
//       fetchCustomerGroups();
//     }
//   }, [showSwitchModal]);
 
//   return (
//     <>
//       <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
//         <MaterialIcons name="account-circle" size={28} color="#007BFA" />
//       </TouchableOpacity>
 
//       <Modal
//         visible={showMenu}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowMenu(false)}
//       >
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setShowMenu(false)}
//         >
//           <View style={styles.menuContent}>
//             <Text style={styles.displayName}>{displayName}</Text>
//             <TouchableOpacity
//               style={styles.menuItem}
//               onPress={() => {
//                 setShowMenu(false);
//                 setShowSwitchModal(true);
//               }}
//             >
//               <MaterialIcons name="swap-horiz" size={24} color="#007BFA" />
//               <Text style={styles.menuItemText}>Switch Account</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.menuItem}
//               onPress={handleLogout}
//             >
//               <MaterialIcons name="logout" size={24} color="#FF4444" />
//               <Text style={[styles.menuItemText, { color: '#FF4444' }]}>
//                 Logout
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Modal>
 
//       <Modal
//         visible={showSwitchModal}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setShowSwitchModal(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Switch Account</Text>
//             {loading ? (
//               <ActivityIndicator size="large" color="#007BFA" />
//             ) : error ? (
//               <>
//                 <Text style={styles.errorText}>{error}</Text>
//                 {__DEV__ && debugInfo && (
//                   <Text style={styles.debugText}>{debugInfo}</Text>
//                 )}
//               </>
//             ) : (
//               <DropDownPicker
//                 open={open}
//                 value={value}
//                 items={items}
//                 setOpen={setOpen}
//                 setValue={setValue}
//                 setItems={setItems}
//                 placeholder="Select an account"
//                 style={styles.dropdown}
//                 dropDownContainerStyle={styles.dropdownContainer}
//                 containerStyle={{ marginBottom: 20 }}
//                 selectedItemContainerStyle={styles.selectedItemContainer}
//                 selectedItemLabelStyle={styles.selectedItemLabel}
//               />
//             )}
//             <TouchableOpacity
//               style={[
//                 styles.switchButton,
//                 (loading || !!error) && styles.disabledButton
//               ]}
//               onPress={handleSwitchAccount}
//               disabled={loading || !!error}
//             >
//               <Text style={styles.switchButtonText}>Switch</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.cancelButton}
//               onPress={() => setShowSwitchModal(false)}
//             >
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };
 
// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'flex-start',
//     alignItems: 'flex-end',
//     paddingTop: 60,
//     paddingRight: 20,
//   },
//   menuContent: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 12,
//     minWidth: 200,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   displayName: {
//     fontSize: 16,
//     fontWeight: '600',
//     paddingVertical: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E5E5',
//     marginBottom: 8,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   menuItemText: {
//     marginLeft: 12,
//     fontSize: 16,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 20,
//     width: '90%',
//     maxWidth: 400,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   dropdown: {
//     borderColor: '#E5E5E5',
//   },
//   dropdownContainer: {
//     borderColor: '#E5E5E5',
//   },
//   selectedItemContainer: {
//     backgroundColor: '#F0F9FF',
//   },
//   selectedItemLabel: {
//     color: '#007BFA',
//     fontWeight: '600',
//   },
//   switchButton: {
//     backgroundColor: '#007BFA',
//     padding: 12,
//     borderRadius: 6,
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   switchButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   cancelButton: {
//     padding: 12,
//     borderRadius: 6,
//     alignItems: 'center',
//   },
//   cancelButtonText: {
//     color: '#666',
//     fontSize: 16,
//   },
//   errorText: {
//     color: '#FF4444',
//     textAlign: 'center',
//     marginBottom: 12,
//   },
//   debugText: {
//     color: '#666',
//     fontSize: 12,
//     marginTop: 8,
//     fontFamily: 'monospace',
//   },
 
// });
 
// export default ProfileMenu;
 

import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { RootStackParamList } from "../type/types";
import { useDisplayName } from "./contexts/DisplayNameContext";

const BACKEND_URL = "http://192.168.1.3:3000"; // Update with your actual backend URL

interface ProfileMenuProps {
  displayName: string | null;
  onAccountSwitch?: () => void;
}

interface AccountItem {
  label: string;
  value: string;
  default?: boolean;
  customerId: number;
  groupId: number;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ displayName, onAccountSwitch }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<AccountItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  const { setDisplayName } = useDisplayName();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const fetchCustomerGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo(null);

      const groupId = await AsyncStorage.getItem("FK_CUST_GROUP_ID");
      console.log('Stored FK_CUST_GROUP_ID:', groupId);

      if (!groupId) {
        throw new Error("No customer group ID found");
      }

      setDebugInfo(`Fetching accounts for group ID: ${groupId}`);

      const response = await axios.post(
        `${BACKEND_URL}/sf/listAccounts`,
        { FK_CUST_GROUP_ID: parseInt(groupId) }
      );

      if (!response.data.output || response.data.output.count === 0) {
        throw new Error("No customer groups found");
      }

      const accountItems: AccountItem[] = response.data.output.groups.map(
        (group: { DISP_NAME: any; CUSTOMER_NAME: any; FK_CUSTOMER_ID: any; FK_CUST_GROUP_ID: any; DEF: number; }) => ({
          label: `${group.DISP_NAME} `,
          value: group.DISP_NAME,
          customerId: group.FK_CUSTOMER_ID,
          groupId: group.FK_CUST_GROUP_ID,
          default: group.DEF === 1,
        })
      );

      setItems(accountItems);
     
      // Set initial value to current display name or default account
      const currentAccount = accountItems.find(item => item.value === displayName)
        || accountItems.find(item => item.default)
        || accountItems[0];
       
      if (currentAccount) {
        setValue(currentAccount.value);
      }

    } catch (error: any) {
      console.error("Error fetching customer groups:", error);
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      setDebugInfo(`Error: ${JSON.stringify(error.response?.data || error.message)}`);

      if (error.message === "No customer group ID found") {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "userToken",
        "Disp_name",
        "FK_CUST_GROUP_ID",
        "customerID",
      ]);
      setShowMenu(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "OtpVerificationScreen" }],
      });
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  const handleSwitchAccount = async () => {
    if (!value) {
      Alert.alert("Error", "Please select an account");
      return;
    }

    try {
      const selectedAccount = items.find((item) => item.value === value);
      if (!selectedAccount) {
        throw new Error("Invalid account selected");
      }

      await Promise.all([
        AsyncStorage.setItem(
          "customerID",
          selectedAccount.customerId.toString()
        ),
        AsyncStorage.setItem("Disp_name", selectedAccount.label),
        AsyncStorage.setItem(
          "FK_CUST_GROUP_ID",
          selectedAccount.groupId.toString()
        ),
      ]);

      // Call the onAccountSwitch callback if provided
      if (onAccountSwitch) {
        onAccountSwitch();
      }

      setDisplayName(selectedAccount.label);
      setShowSwitchModal(false);

      navigation.reset({
        index: 0,
        routes: [
          {
            name: "HomeScreen",
            params: {
              switchedAccount: true,
              newCustomerId: selectedAccount.customerId.toString(),
              timestamp: Date.now() // Force refresh
            }
          }
        ]
      });
    } catch (error: any) {
      console.error("Error switching account:", error);
      Alert.alert("Error", error.message || "Failed to switch account");
    }
  };

  useEffect(() => {
    if (showSwitchModal) {
      fetchCustomerGroups();
    }
  }, [showSwitchModal]);

  return (
    <>
      <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
        <MaterialIcons name="account-circle" size={28} color="#007BFA" />
      </TouchableOpacity>

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.profileHeader}>
                <MaterialIcons name="account-circle" size={80} color="#007BFA" />
                <Text style={styles.displayName}>{displayName || "User"}</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  setShowSwitchModal(true);
                }}
              >
                <MaterialIcons name="swap-horiz" size={24} color="#333" />
                <Text style={styles.menuText}>Switch Account</Text>
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <MaterialIcons name="logout" size={24} color="#333" />
                <Text style={styles.menuText}>Logout</Text>
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showSwitchModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSwitchModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Switch Account</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#007BFA" />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder="Select an account"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                containerStyle={{ marginBottom: 20 }}
                selectedItemContainerStyle={styles.selectedItemContainer}
                selectedItemLabelStyle={styles.selectedItemLabel}
              />
            )}
            <TouchableOpacity
              style={styles.switchButton}
              onPress={handleSwitchAccount}
              disabled={loading || !!error}
            >
              <Text style={styles.switchButtonText}>Switch</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowSwitchModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuContainer: {
    width: 250,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginTop: 50,
    marginRight: 10,
    elevation: 5,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  displayName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    width: "100%",
    marginVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  menuText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  dropdown: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  dropdownContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
  },
  selectedItemContainer: {
    backgroundColor: "#e6f7ff",
  },
  selectedItemLabel: {
    color: "#007BFA",
  },
  switchButton: {
    backgroundColor: "#007BFA",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  switchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
  },
});

export default ProfileMenu;
