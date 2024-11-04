import { useState } from 'react';
import styles from '@/components/FoodItem/FoodItem.style';
import { useRouter } from 'expo-router';
import FoodItemCard from '@/components/FoodItemCard/FoodItemCard'
import { 
    View, 
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList,
    ActivityIndicator
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const FoodItem = () => {
    //THIS IS BUILT-IN TEST DATA. REMOVE LATER
    const DATA = [
      {
        id: '1000',
        name: 'Blackberry peach',
        expirationDate: "11/03/2024",
        imageURL: "tba"
      },
      {
        id: '2000',
        name: 'Potato',
        expirationDate: "11/03/2024",
        imageURL: "tba"
      },
      {
        id: '3000',
        name: 'Tomato',
        expirationDate: "11/03/2024",
        imageURL: "tba"
      },
      {
        id: '4000',
        name: 'Cheese',
        expirationDate: "11/03/2024",
        imageURL: "tba"
      },
      {
        id: '5000',
        name: 'Banana',
        expirationDate: "11/03/2024",
        imageURL: "tba"
      },
      {
        id: '6000',
        name: 'Apple',
        expirationDate: "11/03/2024",
        imageURL: "tba"
      },
      {
        id: '7000',
        name: 'Chicken',
        expirationDate: "11/03/2024",
        imageURL: "tba"
      },
      {
        id: '8000',
        name: 'End',
        expirationDate: "11/03/2024",
        imageURL: "tba"
      },
    ];
    const isLoading = false;
    const error = false;

    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState();

    const handleCardPress = (item) => {
        router.push(`/item-details/${item.id}`);
        setSelectedItem(item.id);
      };

    return (
        <View style={{flex: 1}}>
            <SafeAreaProvider>
                <SafeAreaView style={{flex: 1}}>
                    <View style={styles.cardsContainer}>
                        {isLoading ? (
                            <ActivityIndicator size='large' color={"000000"} />
                        ) : error ? (
                            <Text> Something went wrong </Text>
                        ) : (
                            <FlatList 
                              data={DATA}
                              renderItem={({ item }) => (
                                  <FoodItemCard
                                      item={item}
                                      selectedItem={selectedItem}
                                      handleCardPress={handleCardPress}
                                  />
                              )}
                              keyExtractor={item => item?.id}
                              contentContainerStyle={{paddingBottom: 20, flexGrow: 1}}
                              showsVerticalScrollIndicator={false} 
                            />
                        )}
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </View>
    )
}

export default FoodItem

