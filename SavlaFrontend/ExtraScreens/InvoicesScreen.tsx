import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// Define the Product type
type Product = {
  id: string;
  name: string;
  quantity: number;
  type: string;
};

// Define the Invoice type
interface Invoice {
  type: string;
  products: { name: string; inwards: number; outwards: number }[];
}

const InvoicesScreen: React.FC = () => {
  const [inwardsData, setInwardsData] = useState<Product[]>([]);
  const [outwardsData, setOutwardsData] = useState<Product[]>([]);
  const [invoiceData, setInvoiceData] = useState<Invoice[]>([]);

  useEffect(() => {
    // Fetch Inwards and Outwards data from state/store (replace with your actual data fetching logic)
    const fetchedInwardsData: Product[] = [
      { id: '1', name: 'Apple', quantity: 100, type: 'Fruits' },
      { id: '2', name: 'Milk', quantity: 50, type: 'Milk Products' },
      { id: '3', name: 'Orange', quantity: 80, type: 'Fruits' },
      // ...other inwards products
    ];

    const fetchedOutwardsData: Product[] = [
      { id: '1', name: 'Apple', quantity: 20, type: 'Fruits' },
      { id: '2', name: 'Milk', quantity: 10, type: 'Milk Products' },
      { id: '3', name: 'Orange', quantity: 30, type: 'Fruits' },
      // ...other outwards products
    ];

    setInwardsData(fetchedInwardsData);
    setOutwardsData(fetchedOutwardsData);

    const productTypes = Array.from(
      new Set([...fetchedInwardsData.map((p) => p.type), ...fetchedOutwardsData.map((p) => p.type)])
    );

    const invoices: Invoice[] = productTypes.map((type) => {
      const productsInwards = fetchedInwardsData
        .filter((item) => item.type === type)
        .reduce((acc, item) => {
          acc[item.name] = (acc[item.name] || 0) + item.quantity;
          return acc;
        }, {} as Record<string, number>);

      const productsOutwards = fetchedOutwardsData
        .filter((item) => item.type === type)
        .reduce((acc, item) => {
          acc[item.name] = (acc[item.name] || 0) + item.quantity;
          return acc;
        }, {} as Record<string, number>);

      const products = Object.keys(productsInwards).map((name) => ({
        name,
        inwards: productsInwards[name],
        outwards: productsOutwards[name] || 0,
      }));

      return {
        type,
        products,
      };
    });

    setInvoiceData(invoices);
  }, []);

  const renderItem = ({ item }: { item: Invoice }) => (
    <View style={styles.section}>
      <Text style={styles.typeText}>{item.type}</Text>
      {item.products.length > 0 ? (
        item.products.map((product) => (
          <View key={product.name} style={styles.productItem}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productDetail}>Inwards: {product.inwards}</Text>
            <Text style={styles.productDetail}>Outwards: {product.outwards}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>No data available</Text>
      )}
    </View>
  );

  return (
    <FlatList
      data={invoiceData}
      keyExtractor={(item) => item.type}
      renderItem={renderItem}
      ListHeaderComponent={<Text style={styles.header}>Invoice Summary</Text>}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  typeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#91d3f8',
  },
  productItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productDetail: {
    fontSize: 14,
    color: '#555',
  },
  noData: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    padding: 10,
  },
});

export default InvoicesScreen;
