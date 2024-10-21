import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ReportType = 'Inwards' | 'Outwards';

interface ReportItem {
  id: string;
  outwardNo: string;
  outwardDate: string;
  vehicle: string;
  deliveredTo: string;
  outQty: number;
}

const DUMMY_INWARD_DATA: ReportItem[] = [
  { id: '1', outwardNo: 'DC103524', outwardDate: '01/12/2021', vehicle: 'MH 17 AG 6604', deliveredTo: 'F-28', outQty: 1 },
  { id: '2', outwardNo: 'DC106871', outwardDate: '09/12/2021', vehicle: 'MH 04 AG 7880', deliveredTo: 'F-28', outQty: 2 },
  { id: '3', outwardNo: 'DC45023', outwardDate: '29/07/2022', vehicle: 'MH 04 AG 7880', deliveredTo: 'F-28', outQty: 2 },
  { id: '4', outwardNo: 'DC57232', outwardDate: '29/08/2022', vehicle: 'MH 17 AG 6604', deliveredTo: 'F-28', outQty: 2 },
  { id: '5', outwardNo: 'DC9954', outwardDate: '29/04/2023', vehicle: 'MH 17 AG 6604', deliveredTo: 'F-28', outQty: 1 },
];

const DUMMY_OUTWARD_DATA: ReportItem[] = [
  { id: '1', outwardNo: 'DC103524', outwardDate: '01/12/2021', vehicle: 'MH 17 AG 6604', deliveredTo: 'F-28', outQty: 1 },
  { id: '2', outwardNo: 'DC106871', outwardDate: '09/12/2021', vehicle: 'MH 04 AG 7880', deliveredTo: 'F-28', outQty: 2 },
  { id: '3', outwardNo: 'DC45023', outwardDate: '29/07/2022', vehicle: 'MH 04 AG 7880', deliveredTo: 'F-28', outQty: 2 },
  { id: '4', outwardNo: 'DC57232', outwardDate: '29/08/2022', vehicle: 'MH 17 AG 6604', deliveredTo: 'F-28', outQty: 2 },
  { id: '5', outwardNo: 'DC9954', outwardDate: '29/04/2023', vehicle: 'MH 17 AG 6604', deliveredTo: 'F-28', outQty: 1 },
];

// You would create a similar DUMMY_INWARD_DATA array for inward reports

const ReportsScreen: React.FC = () => {
  const [activeReport, setActiveReport] = useState<ReportType>('Outwards');

  const renderItem = ({ item }: { item: ReportItem }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.outwardNo}</Text>
      <Text style={styles.tableCell}>{item.outwardDate}</Text>
      <Text style={styles.tableCell}>{item.vehicle}</Text>
      <Text style={styles.tableCell}>{item.deliveredTo}</Text>
      <Text style={styles.tableCell}>{item.outQty}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, activeReport === 'Inwards' && styles.activeToggle]}
          onPress={() => setActiveReport('Inwards')}
        >
          <Text style={[styles.toggleText, activeReport === 'Inwards' && styles.activeToggleText]}>Inwards</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, activeReport === 'Outwards' && styles.activeToggle]}
          onPress={() => setActiveReport('Outwards')}
        >
          <Text style={[styles.toggleText, activeReport === 'Outwards' && styles.activeToggleText]}>Outwards</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Outward No</Text>
        <Text style={styles.headerCell}>Outward Date</Text>
        <Text style={styles.headerCell}>Vehicle</Text>
        <Text style={styles.headerCell}>Delivered To</Text>
        <Text style={styles.headerCell}>Out Qty</Text>
      </View>

      <FlatList
        data={activeReport === 'Outwards' ? DUMMY_OUTWARD_DATA : DUMMY_INWARD_DATA} // Replace with DUMMY_INWARD_DATA for inwards
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginRight: 8,
  },
  activeToggle: {
    backgroundColor: '#F28C28',
  },
  toggleText: {
    fontWeight: 'bold',
    color: '#333',
  },
  activeToggleText: {
    color: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
  },
  tableCell: {
    flex: 1,
    fontSize: 12,
  },
});

export default ReportsScreen;