import React, { useState, useEffect } from 'react';
import styles from '@/components/FoodItem/FoodItem.style';
import { useRouter } from 'expo-router';
import FoodItemCard from '@/components/FoodItemCard/FoodItemCard';
import { 
    View, 
    Text, 
    ActivityIndicator, 
    FlatList 
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const FoodItem = () => {
    const [data, setData] = useState([]); // Store inventory data
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    const [error, setError] = useState(false); // Track errors
    const router = useRouter();
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger to refresh data
    const [selectedItem, setSelectedItem] = useState();

    // Fetch data from the backend
    useEffect(() => {
        fetchData();
    }, [refreshTrigger]);

    // Function to refresh data
    const refreshData = () => {
      setRefreshTrigger((prev) => prev + 1); // Increment refreshTrigger to activate useEffect
    };

    const fetchData = async () => {
      try {
          const response = await fetch('http://192.168.1.238:5000/items'); // Replace with your Flask API URL
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          let result = await response.json();

          // Sort the data by expiration date (earliest to latest)
          result.sort((a, b) => {
              const dateA = new Date(a.expirationDate);
              const dateB = new Date(b.expirationDate);
              return dateA - dateB; // Ascending order: past to future
          });

          setData(result);
          setIsLoading(false);
      } catch (err) {
          console.error('Error fetching data:', err);
          setError(true);
          setIsLoading(false);
      }
    };

    // Event handler for item card press
    const handleCardPress = (item) => {
        router.push(`/item-details/${item.id}`);
        setSelectedItem(item.id);
    };

    return (
        <View style={{ flex: 1 }}>
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.cardsContainer}>
                        {isLoading ? ( // Show loading indicator
                            <ActivityIndicator size='large' color="#000000" />
                        ) : error ? ( // Show error message
                            <Text>Something went wrong while fetching data.</Text>
                        ) : (
                            <FlatList 
                                data={data} // Use fetched data
                                renderItem={({ item }) => (
                                    <FoodItemCard
                                        item={item}
                                        selectedItem={selectedItem}
                                        handleCardPress={handleCardPress}
                                    />
                                )}
                                keyExtractor={(item) => item?.id.toString()}
                                contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </View>
    );
};

export default FoodItem;
