import { router } from 'expo-router';

export const handleSaveFood = async (
  foodName: string,
  quantity: number,
  expirationDate: string,
  imageUri: string | null,
  itemSize: string
) => {
  try {
    const response = await fetch('http://192.168.1.238:5000/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: foodName,
        quantity: quantity,
        expiration_date: expirationDate,
        image_uri: imageUri,
        size: itemSize
      }),
    });

    if (!response.ok) {
      throw new Error(`Error saving food: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(result.message); // Log success message


    // Navigate back to the previous screen
    router.replace('../../'); // Adjust the navigation path as needed
    
  } catch (error) {
    console.error('Error saving food:', error);
  }
};
