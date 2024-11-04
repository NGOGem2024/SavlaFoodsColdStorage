import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { RootStackParamList } from "../../App";
import { auth } from "../../firebaseconfig";

type HeaderProps = {
  displayName: string | null;
  cartItemCount: number;
};

const { width } = Dimensions.get('window');

const Header: React.FC<HeaderProps> = ({ displayName, cartItemCount }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem("Disp_name");
      navigation.navigate("OtpVerificationScreen");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Image
          source={require("../../assets/New folder/SavlaLogo.png")}
          style={styles.logo}
        />
      </View>

      <View style={styles.centerSection}>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          {displayName || "Loading..."}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity
          onPress={() => navigation.navigate("CartScreen")}
          style={styles.iconButton}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="shopping-cart" size={24} color="#000" />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleLogout} 
          style={styles.iconButton}
        >
          <View style={styles.iconContainer}>
            <MaterialIcons name="logout" size={24} color="#000" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    backgroundColor: "#fff",
    height: 65,
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  leftSection: {
    width: 45,
    height: 45,
    justifyContent: 'center',
  },
  centerSection: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 90, // Fixed width for the icons section
    // gap: 5,
  },
  logo: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 16,
    color: "#007BFA",
    fontWeight: "bold",
    textAlign: "center",
    maxWidth: width - 200, // Ensure text doesn't overlap with icons
  },
  iconButton: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 25,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Header;