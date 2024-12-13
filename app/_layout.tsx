import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { Button } from 'react-native';
import { useRouter } from 'expo-router';  // Use router for navigation
// AppNavigator.js



export default function RootLayout() {

  //const navigation = useNavigation(); 
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  console.log('isLoggedIn:', isLoggedIn);
  console.log('Rendering screen:', isLoggedIn === false ? 'login' : '(tabs)');
  
  
  // Conditional navigation based on login state
  return (
    <Stack>
      
        <Stack.Screen
            name="(tabs)"
            options={{
                headerShown: false, // Ensure no header is shown for the tab layout
            }}
        />

        <Stack.Screen
            name = "login"
            options = {{
                headerShown: false,
            }}
        />

        {/* Other non-tab screens */}
        <Stack.Screen
            name="add_food"
            options={{
                title: 'Add Item',
                presentation: 'card',
                headerLeft: () => (
                    <Button
                        title="Cancel"
                        onPress={() => router.back()}
                    />
                ),
                headerRight: () => (
                    <Button
                        title="Skip"
                        onPress={() => router.push('../add_food_manual')}
                    />
                ),
            }}
        />
        <Stack.Screen
            name="add_food_manual"
            options={{
                title: 'New Item',
                presentation: 'card',
                headerLeft: () => (
                    <Button
                        title="Back"
                        onPress={() => router.back()}
                    />
                ),
            }}
        />
      </Stack>
);
}
