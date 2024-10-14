import { useState } from 'react';
import { 
    View, 
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';

//List all food items here
const allFoodItems = ["Tomato", "Broccoli", "Celery", "Test"];

const FoodItem = () => {
    const router = useRouter();
    const [activeFoodType, setActiveFoodType] = useState('Tomato');

    return (
        <View>
            <View style={{width: '100%'}}>
                <FlatList 
                    data={allFoodItems}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.tab}>
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    )
}

export default FoodItem

const styles = StyleSheet.create({
    tab: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 16,
        borderWidth: 1
    }
});
