import React, { useState,useEffect,useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Image,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'; // Import DropDownPicker
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { handleSaveFood } from './save_food_helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

interface AddFoodManualProps {
  onSave: () => void; // Callback to refresh the parent component
  onClose: () => void; // Callback to close the AddFoodManual screen
}

interface RouteParams {
  product_name?: string; // Make it optional if not always passed
}

const AddFoodManual: React.FC<AddFoodManualProps> = ({ onSave, onClose }) => {

  
  const [foodName, setFoodName] = useState('');
  const [itemSize, setItemSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [expireSwitch, setExpireSwitch] = useState(false);
  const [listType, setListType] = useState('Fridge');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const isDateSelected = useRef(false); 
  const [image, setImage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    // List of dropdown options
    { label: 'Fridge', value: 'Fridge' },
    { label: 'Pantry', value: 'Pantry' },
  ]);

  useEffect(() => {
    const fetchProductName = async () => {
      const productName = await AsyncStorage.getItem('product_name');
      const size = await AsyncStorage.getItem('size');
      setFoodName(productName || '');
      setItemSize(size || '');
    };
  
    fetchProductName();
  }, []);


  
  const handleImagePicker = async () => {
    try {
      
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission is required to use this feature.');
        return;
      }
  
      // execute the camera app
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true, //
        aspect: [1, 1], // 
        quality: 1, // 
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri); //
        console.log('Image URI:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  // Handle toggling expiration
  const toggleExpiration = () => {
    setExpireSwitch((prev) => {
      const newState = !prev;
  
      if (newState) {
        setShowDatePicker(true); // open DatePicker
      } else {
        setShowDatePicker(false); // close DatePicker 
        setExpirationDate(''); // initialize Date
      }
  
      return newState;
    });
  };

  // Handle date change
  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date | undefined
  ) => {
    if (event.type === 'set' && selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); 
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
  
      console.log('Formatted Date:', formattedDate);
  
      setExpirationDate(formattedDate); // set the date
    } else if (event.type === 'dismissed') {
      console.log('Date Picker Dismissed');
    }
  
    // Close DatePicker 
    setShowDatePicker(false);
  };

  const openDatePicker = () => {
    isDateSelected.current = false; // initialize flag
    setShowDatePicker(true); // open DatePicker 
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () =>
    setQuantity((quantity) => Math.max(1, quantity - 1));

  const saveFood = async () => {

    if (!foodName) {
      alert("Please fill in Item Name.");
      return;
    }

    handleSaveFood(foodName, quantity, expirationDate, image, itemSize)

    // Reset the state after saving
    setFoodName('');
    setQuantity(1); // Reset quantity (optional)
    setExpirationDate(''); // Reset expiration date (optional)
    setImage(null); // Reset the image

    // Clear the product name from AsyncStorage
    await AsyncStorage.removeItem('product_name');
  };

  return (
    <View style={styles.container}>
      {/* Image Picker */}
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={
          handleImagePicker
        }
      >
        <Image
          source={
            image 
              ? { uri: image } 
              : { uri: 'https://img.freepik.com/premium-vector/fork-spoon-logo-design-icon-symbol-health-restaurant-food_1041562-261.jpg' } 
          }
          style={image ? styles.imageFull : styles.imageSmall} 
          resizeMode="cover"
        />
        {!image && ( 
          <Text style={styles.addImageText}>Tap to add a item image</Text>
        )}
      </TouchableOpacity>
      

      {/* Food Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={foodName}
        onChangeText={setFoodName}
      />

      <TextInput
        style={styles.input}
        placeholder="Size"
        value={itemSize}
        onChangeText={setItemSize}
      />

      {/* Dropdown Menu for Storage Location */}
      <DropDownPicker
        open={open}
        value={listType}
        items={items}
        setOpen={setOpen}
        setValue={setListType}
        setItems={setItems}
        style={styles.dropdown} // Styling for the dropdown
        containerStyle={styles.dropdownContainer} // Optional container styling
      />

      {/* Expiration Switch */}
      <View style={styles.expireContainer}>
        <Text>Expiration Date</Text>
        <Switch value={expireSwitch} onValueChange={toggleExpiration} />
      </View>

      {/* Expiration Date Display */}
      {expireSwitch && expirationDate && (
        <Text style={styles.expirationDateText}>
          Selected Date: {expirationDate}
        </Text>
      )}

      {/* Expiration Date Picker */}
      {expireSwitch && showDatePicker && (
        <DateTimePicker
          value={expirationDate ? new Date(expirationDate) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      {/* Quantity Selector */}
      <View style={styles.quantityContainer}>
        <Text>Quantity</Text>
        <View style={styles.quantityControls}>
          <Button title="-" onPress={decrementQuantity} />
          <Text style={styles.quantityText}>{quantity}</Text>
          <Button title="+" onPress={incrementQuantity} />
        </View>
      </View>

      

      {/* Save Button */}
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={saveFood} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#d6f5ff',
  },

  imageContainer: {
    height: 250,
    width: '100%',
    backgroundColor: 'rgb(255, 255, 255)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden'
  },

  imageFull: {
    width: '100%', 
    height: '100%',
  },
  imageSmall: {
    width: 100, 
    height: 100,
  },

  addImageText: {
    color: 'Black',
    fontSize: 16,
    marginTop: 8,
  },

  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
    color: 'black',
  },

  expireContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },

  dropdown: {
    backgroundColor: '#d6f5ff', // Customize dropdown appearance
  },

  dropdownContainer: {
    marginBottom: 12,
  },

  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },

  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  quantityText: {
    marginHorizontal: 10,
    color: 'black',
  },

  buttonContainer: {
    marginTop: 20,
  },
  expirationDateText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  }
});

export default AddFoodManual;
