import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

const carouselData = [
  { id: '3', image: require('../../assets/s3.png') },
  { id: '1', image: require('../../assets/s1.png') },
  { id: '2', image: require('../../assets/s2.png') },
];

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex === carouselData.length - 1) {
        setCurrentIndex(0);
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
      } else {
        setCurrentIndex(currentIndex + 1);
        flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const renderCarouselItem = ({ item }: { item: { id: string; image: any } }) => {
    return (
      <View style={styles.carouselItemContainer}>
        <Image source={item.image} style={styles.carouselImage} />
      </View>
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        data={carouselData}
        renderItem={renderCarouselItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        bounces={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: 160, // Reduced height
    marginTop: 0, // Removed top margin
    marginBottom: 10, // Added bottom margin for spacing
  },
  carouselItemContainer: {
    width,
    height: 170, // Match container height
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselImage: {
    width: width - 20, // Added side margins
    height: 160, // Slightly smaller than container
    resizeMode: 'cover',
    borderRadius: 10, // Added rounded corners
  },
});

export default Carousel;