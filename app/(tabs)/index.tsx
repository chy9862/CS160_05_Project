import React, {useState,useEffect} from 'react';
import { Text, View, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity,TextInput } from 'react-native';
import { Ionicons,MaterialIcons } from '@expo/vector-icons'; // Import Ionicons for the plus sign
import { BarCodeScanner } from 'expo-barcode-scanner'; // Import BarCodeScanner from Expo
import FoodItem from '@/components/FoodItem/FoodItem';

export default function FoodInventoryScreen() {
  
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView>
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
            <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Barcode scanner button pressed')}>
              <MaterialIcons name="qr-code-scanner" size={30} color="#3dabff" /> 
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => console.log('Plus button pressed')}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d6f5ff',
  },
  topBar: {
    flexDirection: 'row', // Arrange items in a row (text on the left, button on the right)
    justifyContent: 'space-between', // Space between text and button
    alignItems: 'center', // Align items vertically centered
    backgroundColor: '#fff', // Background color for the bar
    padding: 10, // Padding inside the bar
    borderBottomWidth: 1, // Optional: Add a border at the bottom of the bar
    borderBottomColor: '#ccc', // Optional: Border color
  },
  searchBar: {
    flex: 1, // Makes the search bar take up most of the space
    height: 40, // Adjust the height of the search bar
    backgroundColor: '#f0f0f0', // Background color for the search bar
    borderRadius: 5, // Rounded corners for the search bar
    paddingHorizontal: 10, // Padding inside the search bar
    marginRight: 10, // Margin between the search bar and the plus button
  },

  iconContainer: {
    flexDirection: 'row', // Arrange icons side by side
    alignItems: 'center',
  },

  iconButton: {
    paddingLeft: 10, // Add spacing between the icons
  },

  title: {
    fontSize: 18,
    color: '#030303',
  },
  plusButton: {
    padding: 10, // Increase the touchable area for the button
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
  }
});

