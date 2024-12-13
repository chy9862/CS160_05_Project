import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Modal, Button,ScrollView } from 'react-native';
import axios from 'axios';

// Define the Recipe type
type Recipe = {
  id: number;
  title: string;
  missedIngredientCount: number;
  missedIngredients?: { original: string }[];
  image: string; // Add the image field
  readyInMinutes?: number;
  servings?: number;
  instructions?: string;
  extendedIngredients?: { original: string }[]; // Array of ingredient details
};

// Define the InventoryItem type
type InventoryItem = {
  id: number;
  name: string;
  expirationDate: string;
};

export default function MealPlanningScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]); // Explicitly define the state type
  const [inventory, setInventory] = useState<string[]>([]); // Store inventory names
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null); // State for the selected recipe
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchData(); // Fetch inventory data
  }, []);

  

  useEffect(() => {
    if (inventory.length > 0) {
      fetchRecipesFromInventory(); // Fetch recipes once inventory is loaded
    }
  }, [inventory]);

  
  // Fetch inventory data from Flask
  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.1.238:5000/items'); // Replace with your Flask API URL
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result: InventoryItem[] = await response.json();

      // Sort inventory by expiration date (earliest to latest)
      result.sort((a, b) => {
        const dateA = new Date(a.expirationDate);
        const dateB = new Date(b.expirationDate);
        return dateA.getTime() - dateB.getTime();
      });

      // Extract ingredient names for recipe API
      const inventoryNames = result.map((item) => item.name);
      setInventory(inventoryNames);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      alert('Failed to fetch inventory.');
    }
  };

  const fetchRecipesFromInventory = async () => {
    if (!inventory || inventory.length === 0) {
      alert('No ingredients available in inventory.');
      return;
    }

    setLoading(true);

    const ingredients = inventory.join(',');

    const options = {
      method: 'GET',
      url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients',
      params: {
        ingredients,
        number: '5',
        ignorePantry: 'true',
        ranking: '1',
      },
      headers: {
        'x-rapidapi-key': '921e6b6c44mshcf32bd2dd127e2ap1554a1jsne7e564a4dc0f',
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      const updatedRecipes = response.data.map((recipe: any) => ({
        ...recipe,
        missedIngredients: recipe.missedIngredients, // Include missedIngredients
      }));
      setRecipes(updatedRecipes); // Ensure response.data matches the Recipe[] type
    } catch (error) {
      console.error('Error fetching recipes:', error);

      // Check error structure and log relevant details
      if (axios.isAxiosError(error)) {
        // Axios-specific error
        console.error('Axios error details:', error.response?.data || error.message);
        alert(`Error: ${error.response?.data?.message || error.message}`);
      } else {
        // Non-Axios error
        alert('An unexpected error occurred. Please try again.');
    }
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipeDetails = async (id: number) => {
    setDetailLoading(true);

    const options = {
      method: 'GET',
      url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`,
      headers: {
        'x-rapidapi-key': '921e6b6c44mshcf32bd2dd127e2ap1554a1jsne7e564a4dc0f',
        'x-rapidapi-host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);

      setSelectedRecipe((prev) => {
        if (!prev) return response.data; // Fallback if no previous state
        return {
          ...prev, // Retain existing fields (like `missedIngredients`)
          ...response.data, // Merge new details from the API
          extendedIngredients: response.data.extendedIngredients,
          instructions: response.data.instructions,
        };
      });

    } catch (error) {
      console.error('Error fetching recipe details:', error);
      alert('Failed to load recipe details.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe); 
    fetchRecipeDetails(recipe.id); // Fetch detailed information
    setModalVisible(true); // Open the modal
  };

  return (
    <View style={styles.container}>
     
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : recipes.length > 0 ? (
        <>
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.recipeCard}
                onPress={() => handleRecipePress(item)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.recipeImage}
                  resizeMode="cover"
                />
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <Text>Missing Ingredients: {item.missedIngredientCount}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Modal for Recipe Details */}
          {selectedRecipe && (
            <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                  {detailLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                  ) : (
                    <>
                      <Image
                        source={{ uri: selectedRecipe.image }}
                        style={styles.modalImage}
                        resizeMode="cover"
                      />
                      <Text style={styles.modalTitle}>{selectedRecipe.title}</Text>
                      <Text style={styles.modalText}>
                        Ready in {selectedRecipe.readyInMinutes} minutes | Servings: {selectedRecipe.servings}
                      </Text>

                      <Text style={styles.modalSubtitle}>Missing Ingredients:</Text>
                      {selectedRecipe.missedIngredients?.map((ingredient, index) => (
                        <Text key={index} style={styles.modalText}>
                          • {ingredient.original}
                        </Text>
                      ))}

                      <Text style={styles.modalSubtitle}>Ingredients:</Text>
                      {selectedRecipe.extendedIngredients?.map((ingredient, index) => (
                        <Text key={index} style={styles.modalText}>
                          • {ingredient.original}
                        </Text>
                      ))}
                      <Text style={styles.modalSubtitle}>Instructions:</Text>
                      <Text style={styles.modalText}>
                        {selectedRecipe.instructions || 'No instructions available.'}
                      </Text>
                    </>
                  )}
                </ScrollView>
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
          )}
        </>


      ) : (
        <Text style={styles.noData}>No recipes found for your inventory.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d6f5ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  recipeCard: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    width: '100%',
  },
  recipeImage: {
    width: 325,
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noData: {
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },

  modalImage: {
    width: 300,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },


  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
  },
  modalContent: {
    width: '90%', // Width of the modal
    maxHeight: '80%', // Maximum height of the modal
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 20, // Add padding for better scrolling
  },
});
