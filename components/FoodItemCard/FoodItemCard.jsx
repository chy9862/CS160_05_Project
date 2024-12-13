import { View, Text, TouchableOpacity, Image } from 'react-native'
import styles from '@/components/FoodItemCard/FoodItemCard.style';

import {checkImageURL} from '@/utils/index.js'

// Create a card object that when pressed, sends you to the item page. The card displays the item name, expiration date, and the item image
const FoodItemCard = ({ item, selectedItem, handleCardPress }) => {
    
    const defaultImageURL = 'https://img.freepik.com/premium-vector/fork-spoon-logo-design-icon-symbol-health-restaurant-food_1041562-261.jpg';
    
    const imageSource = item.imageURL && item.imageURL.trim() !== ''
        ? { uri: item.imageURL } 
        : { uri: defaultImageURL }; 
    return (
        // Make the card pressable and handle card press action with the passed in handleCardPress function from FoodItem.jsx
        <TouchableOpacity
            style={styles.container(selectedItem, item)}
            onPress={() => handleCardPress(item)}    
        >
            <View style={styles.rowContainer}>
                <TouchableOpacity style={styles.logoContainer(selectedItem, item)}>
                    {/* Display the product's image from API database. If the product does not have an image, use a default image */}
                    <Image 
                        source={imageSource}
                        resizeMode="contain"
                        style={styles.logoImage}
                    />
                </TouchableOpacity>

                {/* Display the product's information here.*/}
                <View style={styles.infoContainer}>
                    {/* Display product name */}
                    <Text style={styles.itemName} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <View style={styles.infoWrapper}>
                        {/* Display expiration date */}
                        <Text style={styles.expiration(selectedItem, item)}>
                            Exp Date: {item.expirationDate} 
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default FoodItemCard;
