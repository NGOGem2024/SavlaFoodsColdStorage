// import React from 'react';
// import {
//   Dimensions,
//   Image,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';

// // Define the type for our item
// interface Item {
//   id: string;
//   code: string;
//   description: string;
//   name: string;
 
// }

// // Sample data
// const sampleItems: Item[] = [
//   {
//     id: '1',
//     code: 'ITEM001',
//     description: 'This is a sample item description',
//     name: 'Sample Item 1',
     
//   },
//   {
//     id: '2',
//     code: 'ITEM002',
//     description: 'Another sample item description',
//     name: 'Sample Item 2',
     
//   },
//   {
//     id: '2',
//     code: 'ITEM002',
//     description: 'Another sample item description',
//     name: 'Sample Item 2',
     
//   },
//   {
//     id: '2',
//     code: 'ITEM002',
//     description: 'Another sample item description',
//     name: 'Sample Item 2',
     
//   },
//   {
//     id: '2',
//     code: 'ITEM002',
//     description: 'Another sample item description',
//     name: 'Sample Item 2',
     
//   },
// ];

// const ItemDetailScreen: React.FC = () => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView bounces={false}>
//         {/* Main Image Container with Overlay */}
//         <View style={styles.imageContainer}>
//           <Image
//             source={require('../../assets/images/SC14.jpg')} // Replace with your image
//             style={styles.mainImage}
//             resizeMode="cover"
//           />
//           <View style={styles.imageOverlay} />
//         </View>

//         {/* Cards Container */}
//         <View style={styles.cardsContainer}>
//           {sampleItems.map((item) => (
//             <View key={item.id} style={styles.card}>
//               {/* Item ID Row */}
//               <View style={styles.detailRow}>
//                 <View style={styles.labelValuePair}>
//                   <Text style={styles.label}>ITEM ID:</Text>
//                   <Text style={styles.value}>{item.id}</Text>
//                 </View>

               
//               </View>

//               <View style={styles.detailRow}>
//               <View style={styles.labelValuePair}>
//                   <Text style={styles.label}>ITEM CODE:</Text>
//                   <Text style={styles.value}>{item.code}</Text>
//                 </View>
//               </View>

//               {/* Description Row */}
//               <View style={styles.detailRow}>
//                 <View style={styles.labelValuePair}>
//                   <Text style={styles.label}>DESCRIPTION:</Text>
//                   <Text style={styles.value}>{item.description}</Text>
//                 </View>
//               </View>

//               {/* Item Name Row */}
//               <View style={styles.detailRow}>
//                 <View style={styles.labelValuePair}>
//                   <Text style={styles.label}>ITEM NAME:</Text>
//                   <Text style={styles.value}>{item.name}</Text>
//                 </View>
//               </View>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const { width } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   imageContainer: {
//     width: '100%',
//     height: width * 0.3, // Aspect ratio 3:5
//     position: 'relative',
//     marginBottom: -20, // Overlap with cards
//   },
//   mainImage: {
//     // marginTop:20,
//     width: '100%',
//     height: '100%',
//   },
//   imageOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.1)', // Subtle overlay
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   cardsContainer: {
//     padding: 16,
//     paddingTop: 20,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     marginBottom: 16,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     marginBottom: 12,
//     flexWrap: 'wrap',
//   },
//   labelValuePair: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 20,
//     flexShrink: 1,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#666',
//     marginRight: 8,
//   },
//   value: {
//     fontSize: 14,
//     color: '#333',
//     flexShrink: 1,
//   },
// });

// export default ItemDetailScreen;
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

interface Item {
  id: string;
  code: string;
  description: string;
  name: string;
}

const sampleItems: Item[] = [
  {
    id: '1',
    code: 'ITEM001',
    description: 'This is a sample item description',
    name: 'Sample Item 1',
  },
  {
    id: '1',
    code: 'ITEM001',
    description: 'This is a sample item description',
    name: 'Sample Item 1',
  },
  {
    id: '1',
    code: 'ITEM001',
    description: 'This is a sample item description',
    name: 'Sample Item 1',
  },
  {
    id: '1',
    code: 'ITEM001',
    description: 'This is a sample item description',
    name: 'Sample Item 1',
  },
  {
    id: '1',
    code: 'ITEM001',
    description: 'This is a sample item description',
    name: 'Sample Item 1',
  },
];

const ItemDetailScreen: React.FC = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const imageSlideAnim = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 15,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(imageSlideAnim, {
        toValue: 0,
        tension: 15,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Wrapper for centering the image container */}
        <View style={styles.centerWrapper}>
          {/* Image Container with Animation */}
          <Animated.View 
            style={[
              styles.imageWrapper,
              {
                opacity: fadeAnim,
                transform: [
                  { translateX: imageSlideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <Image
              source={require('../../assets/images/SC32.jpg')}
              style={styles.mainImage}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Cards Container */}
        <View style={styles.cardsContainer}>
          {sampleItems.map((item, index) => (
            <Animated.View 
              key={item.id} 
              style={[
                styles.card,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50 * (index + 1), 0],
                    })
                  }]
                }
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>ITEM ID:</Text>
                <Text style={styles.value}>{item.id}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>ITEM CODE:</Text>
                <Text style={styles.value}>{item.code}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.label}>DESCRIPTION:</Text>
                <Text style={styles.value}>{item.description}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingVertical: 15,
  },
  centerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  imageWrapper: {
    width: '50%', // Match image width
    height: 120,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  cardsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    width: 100,
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    // fontWeight: "bold",
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
});

export default ItemDetailScreen;