import React, {useState,useEffect} from 'react';
import { View, Text, ScrollView, TextInput, SafeAreaView, TouchableOpacity, StyleSheet,ActivityIndicator } from 'react-native';
import { Ionicons,MaterialIcons } from '@expo/vector-icons'; // Import Ionicons for the plus sign
import { useRouter } from 'expo-router';  // Use router for navigation
import * as SecureStore from 'expo-secure-store'; // SecureStore for persistent login state
import { BarCodeScanner } from 'expo-barcode-scanner'; // Import BarCodeScanner from Expo
import FoodItem from '@/components/FoodItem/FoodItem';

export default function FoodInventoryScreen() {

  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter(); // Use router for navigation

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = await SecureStore.getItemAsync('isLoggedIn');
        console.log('SecureStore isLoggedIn:', loggedIn); // Debug log
        if (loggedIn !== 'true') {
          // If user is not logged in, redirect to the login screen
          router.replace('/login');
        } else {
          setIsLoading(false); // User is logged in, stop the loading spinner
        }
      } catch (error) {
        console.error('Error reading login state:', error);
        router.replace('../login'); // Redirect to login on error
      }
    };

    checkLoginStatus();
  }, []);
  
  if (isLoading) {
    // Show a loading spinner while checking login status
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3dabff" />
        <Text>Checking login status...</Text>
      </View>
    );
  }
  
  return (
      <View style={styles.container}>

        {/* Create the top bar including search bar, add button , barcode scanner */}
        <View style={styles.topBar}> 
          <TextInput
            style={styles.searchBar}
            placeholder="Search"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.iconContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push('../add_food')} 
            >
              <Ionicons name="add-circle" size={30} color="#3dabff" />
            </TouchableOpacity>
          </View>
        </View>

        

        {/* List of the Food */}
        <ScrollView>
          <View style={styles.foodList}>
            <FoodItem />
          </View>
        </ScrollView>


      </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d6f5ff',
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },

  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },

  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconButton: {
    paddingLeft: 10,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  foodList: {
    flex: 10,
    justifyContent: 'center',
    padding: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

