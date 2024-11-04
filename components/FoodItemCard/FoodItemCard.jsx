import { View, Text, TouchableOpacity, Image } from 'react-native'
import styles from '@/components/FoodItemCard/FoodItemCard.style';

// Create a card object that when pressed, sends you to the item page. The card displays the item name, expiration date, and the item image
const FoodItemCard = ({ item, selectedItem, handleCardPress }) => {
    return (
        <TouchableOpacity
            style={styles.container(selectedItem, item)}
            onPress={() => handleCardPress(item)}    
        >
            <View style={styles.rowContainer}>
                <TouchableOpacity style={styles.logoContainer(selectedItem, item)}>
                    <Image 
                        source={{ uri: item.imageURL}}
                        resizeMode="contain"
                        // style
                    />
                </TouchableOpacity>

                <View style={styles.infoContainer}>
                    <Text style={styles.itemName} numberOfLines={1}>
                        {item.name}
                        {/* Test text 2 */}
                    </Text>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.expiration(selectedItem, item)}>
                            {item.expirationDate} 
                            {/* Expiration date */}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default FoodItemCard;