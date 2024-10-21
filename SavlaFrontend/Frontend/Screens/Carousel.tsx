import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, Animated, FlatList } from 'react-native';

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
      <View style={{ width }}>
        <Image source={item.image} style={styles.carouselImage} />
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={carouselData}
      renderItem={renderCarouselItem}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      style={styles.carousel}
    />
  );
};

const styles = StyleSheet.create({
  carousel: {
    height: 200,
    marginTop:10
  },
  carouselImage: {
    width,
    height: 220,
    resizeMode: 'cover',
      
  },
});

export default Carousel;