import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Announcement: React.FC = () => {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: -200, // Increased to match the new image width
        duration: 10000, // Slowed down for smoother animation
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <View style={styles.container}>       
      <View style={styles.announcementBox}>
        <View style={styles.imageContainer}>
          <Animated.Image
            source={require('../../../assets/wish/durga.png')}
            style={[
              styles.slidingImage,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Happy Dussehra</Text>
          <Text style={styles.content}>
            Wishing a very Happy Dussehra from "UNICORP ENTERPRISES" to you full of strength to always fight for the right thing in life.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  announcementBox: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderColor: '#900C3F',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#900C3F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
    width: width - 32,
    marginTop: 10,
  },
  imageContainer: {
    width: 150, // Increased width
    height: 200, // Increased height
    overflow: 'hidden',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  slidingImage: {
    width: 400, // Doubled for smooth looping
    height: 200,
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: '#565656',
    lineHeight: 24,
  },
  ann: {
    fontSize: 28,
    color: "#F42286",
    fontWeight: 'bold',
    marginBottom: 16,
  }
});

export default Announcement;