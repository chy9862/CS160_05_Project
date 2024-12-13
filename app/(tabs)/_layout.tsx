import { Stack } from "expo-router";
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, TouchableOpacity,StyleSheet,View} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // or your preferred icon library
 

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3dabff',
        tabBarStyle: {
          height: 90, // Set the desired height of the tab bar here
          paddingBottom: 30, // Optional: Add padding to space out the icons
          paddingTop: 10, // Optional: Add padding at the top for icon alignment
        },
        tabBarLabelStyle: {
          fontSize: 12, // Increase the font size of the label
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarLabel: 'Inventory',
          headerStyle: {
            height: 140, // Set the height of the header
            backgroundColor: '#ffffff', // Optional: Change background color for visibility
          },

          headerTitle: () => (
              <Image
                source={require('../../assets/images/FoodHero_FoodHero_Partners_with_Empire_Company_Limited_to_Combat.jpg')}
                style={{ width: 150, height: 100 }} // Adjust the width and height of the logo
                resizeMode="contain"
              />
           
          ),

          
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'kitchen' : 'kitchen'} color={color} size={30} />
          ),
        }}
      />



      <Tabs.Screen
        name="meal_planning"
        options={{
          title: 'Recipe Recommendation', // seperate tab title in the header
          tabBarLabel: 'Recipe', // label for the tab
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name={focused ? 'restaurant' : 'restaurant'} color={color} size={30} />
          ),
          headerStyle: {
            height: 140, // Set the height of the header
            backgroundColor: '#ffffff', // Optional: Change background color for visibility
          },

          headerTitleStyle: {
            fontSize: 30, // Change the font size here
            
          },
          headerTitleAlign: 'left',
        }}
      />

      <Tabs.Screen
        name="food_donation"
        options={{
          title: 'Food Donation Location', // seperate tab title in the header
          tabBarLabel: 'Donation', // label for the tab
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'map' : 'map-outline'} color={color} size={30} />
          ),
          
        }}
      />

      <Tabs.Screen
        name="gamification"
        options={{
          title: 'Leader Board', // seperate tab title in the header
          tabBarLabel: 'Food Heroes', // label for the tab
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'trophy' : 'trophy'} color={color} size={30} />
          ),
          
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={30}/>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row', // Align items horizontally (logo and button side by side)
    alignItems: 'flex-end', // Align items to the bottom of the header
    justifyContent: 'space-between', // Spread out the logo and button
    paddingHorizontal: 90, // Add horizontal padding
    height: '100%', // Make sure the container takes up the entire header height
  },
  plusButton: {
    paddingBottom: 10, // Adjust to bring the button closer to the bottom of the header
  },
});

<Tabs
  screenOptions={{
    tabBarActiveTintColor: '#3dabff',
    headerStyle: {
      backgroundColor: '#25292e',
    },
    headerShadowVisible: false,
    headerTintColor: '#fff',
    tabBarStyle: {
    backgroundColor: '#25292e',
    },
  }}
></Tabs>
