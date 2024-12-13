import { useNavigation, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, ActivityIndicator, TouchableOpacity} from "react-native";
import axios from "axios";

const BASE_URL = "http://192.168.1.238:5000";

const ItemDetails = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  // Mock database to simulate fetching data based on the item ID
  const mockData = {
    1000: {
      name: "Blackberry Peach",
      expirationDate: "11/03/2024",
      imageURL: "https://img.freepik.com/premium-vector/fork-spoon-logo-design-icon-symbol-health-restaurant-food_1041562-261.jpg", // Replace with actual image URL
      quantity: 3,
    },
    2000: {
      name: "Potato",
      expirationDate: "12/12/2024",
      imageURL: "https://img.freepik.com/premium-vector/fork-spoon-logo-design-icon-symbol-health-restaurant-food_1041562-261.jpg",
      quantity: 5,
    },
    3000: {
      name: "Tomato",
      expirationDate: "01/15/2025",
      imageURL: "https://img.freepik.com/premium-vector/fork-spoon-logo-design-icon-symbol-health-restaurant-food_1041562-261.jpg",
      quantity: 10,
    },
    // Add more mock items as needed
  };

  // State to hold item details
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
        axios
          .get(`${BASE_URL}/items/${id}`)
          .then((response) => {
            const item = response.data;
  
            
            navigation.setOptions({
              title: `Item Details`,
            });
  
            setItemDetails(item);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching item details:", error);
            setLoading(false);
          });
      }
    }, [id]);

  if (loading) {
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }


  // If item is not found, display an error message
  if (!itemDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Item not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: itemDetails.imageURL }} style={styles.image} />
      <Text style={styles.title}>{itemDetails.name}</Text>
      <Text style={styles.info}>Size: {itemDetails.size}</Text>
      <Text style={styles.info}>Expiration Date: {itemDetails.expirationDate}</Text>
      <Text style={styles.info}>Quantity: {itemDetails.quantity}</Text>

      <TouchableOpacity
        style={styles.deleteButton}>
        <Text style={styles.buttonText}>Delete Item</Text>
      </TouchableOpacity>
      
    </View>
  );
};

export default ItemDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    alignSelf :"center",
    
  },

  deleteButton: {
    backgroundColor: '#ff0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 90
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    alignSelf :"center",
  },

  info: {
    fontSize: 18,
    marginBottom: 10,
  },

  errorText: {
    fontSize: 18,
    color: "red",
  },

});
