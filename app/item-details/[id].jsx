import { useNavigation, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet } from "react-native";

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

  useEffect(() => {
    // Dynamically set the header title
    if (id && mockData[id]) {
      const item = mockData[id];
      navigation.setOptions({
        title: `Details - ${item.name}`,
      });

      // Populate item details
      setItemDetails(item);
    }
  }, [id]);

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
      <Text style={styles.info}>Expiration Date: {itemDetails.expirationDate}</Text>
      <Text style={styles.info}>Quantity: {itemDetails.quantity}</Text>
    </View>
  );
};

export default ItemDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});