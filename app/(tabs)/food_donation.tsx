import React, { useState ,useEffect,useRef} from 'react';
import { Text, View, StyleSheet,Alert,TouchableOpacity, Image, Dimensions, FlatList, Linking} from 'react-native';
import MapView, { Marker,Region } from 'react-native-maps';
import { Searchbar } from 'react-native-paper';
import * as Location from 'expo-location';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons'

import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';



// Google Places API Key
const GOOGLE_PLACES_API_KEY = 'AIzaSyAlQQdye4yT8ETJ6U5o3zNnjea3VfQjgQI';

//light mode for map
const lightMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#bdbdbd" }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#eeeeee" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#e5e5e5" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#ffffff" }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#dadada" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#c9c9c9" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  }
];



//Define the structure of each food bank (from Google Places API response)
interface FoodBank {
  name: string;
  place_id: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: {
    photo_reference: string;
  }[]; // Optional photos property
  photoUrl?: string;
  address?: string;
  phoneNumber?: string;
  website?: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');


export default function FoodDonationScreen() {

  const [search, setSearch] = useState<string>('');
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [nearbyFoodBanks, setNearbyFoodBanks] = useState<FoodBank[]>([]); // Store nearby food banks 
  const mapRef = useRef<MapView>(null); // Reference to the MapView component
  const [region, setRegion] = useState({
    latitude: 37.78825, // Default latitude
    longitude: -122.4324, // Default longitude
    latitudeDelta: 0.05, // Default zoom level
    longitudeDelta: 0.05,
  });

  const [selectedFoodBank, setSelectedFoodBank] = useState<FoodBank | null>(null);

  const foodIcon = require('../../assets/images/food_bank_logo.png'); // Adjust path based on your project structure

  const translateY = useSharedValue(SCREEN_HEIGHT * 0.65); // Default to half the screen height
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));


  // Define the pan gesture
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // No need to save the initial translateY, as it's managed by useSharedValue
    })
    .onUpdate((event) => {
      // Allow dragging up and down within screen bounds
      translateY.value = Math.max(Math.min(event.translationY + translateY.value, SCREEN_HEIGHT * 0.5), 0);
    })
    .onEnd(() => {
      // If dragged more than halfway up, snap to top; otherwise, return to half-screen
      if (translateY.value < SCREEN_HEIGHT * 0.25) {
        translateY.value = withSpring(SCREEN_HEIGHT * 0.43); // Expand to full screen
      } else {
        translateY.value = withSpring(SCREEN_HEIGHT * 0.70); // Return to half screen
      }
    });

  // Function to fetch nearby food banks using Google Places API
  const fetchNearbyFoodBanks = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
        params: {
          keyword: 'community food bank food pantry',
          location: `${latitude},${longitude}`, // User's location
          radius: 10000, // 5 km radius
          type: 'establishment', // Adds a specific place type
          key: GOOGLE_PLACES_API_KEY, // API key
        },
      });

      if (response.data.results) {
        const foodBanks = response.data.results.map((foodBank: FoodBank) => {
          const photoReference = foodBank.photos?.[0]?.photo_reference; // Get the first photo reference
          const photoUrl = photoReference
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`
            : null; // Construct photo URL or null if no photo
          return {
            name: foodBank.name,
            place_id: foodBank.place_id,
            geometry: foodBank.geometry,
            photoUrl,
          };
        });
        setNearbyFoodBanks(foodBanks);
      } else {
        Alert.alert('No food banks found nearby');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error fetching nearby food banks');
    }
  };

  const fetchFoodBankDetails = async (placeId: string) => {
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          place_id: placeId,
          fields: 'formatted_address,formatted_phone_number,website',
          key: GOOGLE_PLACES_API_KEY,
        },
      });
  
      if (response.data.result) {
        const { formatted_address, formatted_phone_number, website } = response.data.result;
        // Update the selected food bank with additional details
        setSelectedFoodBank((prev) =>
            prev
              ? {
                  ...prev,
                  address: formatted_address || '',
                  phoneNumber: formatted_phone_number || '',
                  website: website || '',
                }
              : null
          );
        }
    } catch (error) {
      console.error(error);
      Alert.alert('Error fetching food bank details');
    }
  };
  

  // Request user permission for location and get their location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);


      // Set the region to the user's current location
      setRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.05, // Adjust for zoom level
        longitudeDelta: 0.05,
      });

      // Fetch nearby food banks from Google Places API
      fetchNearbyFoodBanks(userLocation.coords.latitude, userLocation.coords.longitude);

      
    })();
  }, []);


  // Update the region and fetch nearby food banks when map region changes
  const onRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion); // Update region state
    fetchNearbyFoodBanks(newRegion.latitude, newRegion.longitude); // Fetch new food banks
  };


  // Center map to user location
  const centerMapToUserLocation = () => {
    if (location) {
      mapRef.current?.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } else {
      Alert.alert('Location not available');
    }
  };


  // Define the updateSearch function with explicit type
  const updateSearch = (text: string): void => {
    setSearch(text);
  };


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          
          {/*MapView & Search Bar*/}
          <View style={styles.mapContainer}>
            {/*Map View*/}
            <MapView
              style={styles.map}
              ref={mapRef}
              region={region} // Center map on the region (updated when the location is found)
              showsUserLocation= {true} // Shows the user's blue dot on the map
              showsMyLocationButton ={true}
              onRegionChangeComplete={onRegionChangeComplete} // Update region and markers on map movement
              customMapStyle={lightMapStyle}
            >
              {/* User Logo Marker */}
              <Marker
                coordinate={{
                  latitude: 37.78825, // Example latitude
                  longitude: -122.4324, // Example longitude
                }}
                title="User Location"
                description="This is the user's location"
              >
                <Image source={require('../../assets/images/user_logo.png')} style={{ width: 60, height: 85 }} />
              </Marker>



              {nearbyFoodBanks.map((foodBank, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: foodBank.geometry.location.lat,
                  longitude: foodBank.geometry.location.lng,
                }}
                title={foodBank.name}
                description={`Food bank near you`}
                onPress={() => {
                  setSelectedFoodBank(foodBank); // Set the selected food bank
                  fetchFoodBankDetails(foodBank.place_id); // Fetch additional details
                }}
              >
                <Image source={foodIcon} style={{ width: 55, height: 40 }} /> 
                {/* Adjust width and height to resize icon */}
              </Marker>
            ))}
            </MapView>
            
            {/*Search Bar*/}
            <Searchbar
              placeholder="Search for locations..."
              onChangeText={(text: string) => updateSearch(text)}  // Pass the function directly
              value={search}
              style={styles.searchbar}
            />

            {/*Location Button */}
            <TouchableOpacity style={styles.locationButton} onPress={centerMapToUserLocation}>
              <MaterialIcons name="my-location" size={30} color="black" />
            </TouchableOpacity>
            
            
            
          </View>
          
          {/* Draggable Bottom Sheet */}
          {selectedFoodBank && (
            <GestureDetector gesture={panGesture}>
              <Animated.View style={[styles.bottomSheet, animatedStyle]}>

                {/* Drag Handle and Close Icon */}
                <View style={styles.dragHandleContainer}>
                  <TouchableOpacity onPress={() => setSelectedFoodBank(null)} style={styles.downArrow}>
                    <MaterialIcons name="keyboard-arrow-down" size={36} color="#ccc" />
                  </TouchableOpacity>
                  <View style={styles.dragHandle} />
                </View>

                {/* Display information about the selected food bank */}
                <View style={styles.listItem}>
                  <Text style={styles.foodBankName}>{selectedFoodBank.name}</Text>

                  {selectedFoodBank.photoUrl && (
                    <Image
                      source={{ uri: selectedFoodBank.photoUrl }}
                      style={styles.foodBankImage}    
                      resizeMode="cover"
                    />
                  )}

                  {/* Address Section */}
                  <TouchableOpacity
                    style={styles.addressContainer}
                    onPress={() =>
                      selectedFoodBank.address
                        ? Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedFoodBank.address)}`)
                        : Alert.alert('Address not available')
                    }
                  >
                    <Text style={styles.foodBankDetails}>
                      <MaterialIcons name="location-on" size={20} color="#555" /> {selectedFoodBank.address || 'Not available'}
                    </Text>
                  </TouchableOpacity>

                  {/* Conditionally render buttons */}
                  <View style={styles.buttonContainer}>
                  {selectedFoodBank.phoneNumber && (
                      <TouchableOpacity
                      style={styles.contactButton}
                      onPress={() =>
                        Alert.alert(
                          `Call ${selectedFoodBank.name}`,
                          `Would you like to call ${selectedFoodBank.phoneNumber}?`,
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel',
                            },
                            {
                              text: 'Call',
                              onPress: () => Linking.openURL(`tel:${selectedFoodBank.phoneNumber}`),
                            },
                          ],
                          { cancelable: true }
                        )
                      }
                    >
                      <Text style={styles.buttonText}>Call </Text>
                    </TouchableOpacity>
                  )}
                  {selectedFoodBank.website && (
                    <TouchableOpacity
                      style={styles.websiteButton}
                      onPress={() => Linking.openURL(selectedFoodBank.website ?? '')} // Handle undefined safely
                    >
                      <Text style={styles.buttonText}>Website</Text>
                    </TouchableOpacity>
                  )}
                </View>
                </View>

                

              </Animated.View>
            </GestureDetector>
          )}

        </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d6f5ff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  text: {
    color: '#030303',
  },

  searchbar: {
    position: 'absolute', // Position the search bar above the map
    top: 70, // Distance from the top of the screen
    zIndex: 1, // Ensure the search bar appears above the map
    width: '90%', // Adjust the width of the search bar
    alignSelf: 'center', // Center the search bar horizontally,
    backgroundColor: 'white'  
  },

  mapContainer: {
    position: 'absolute',
    top: 0, // Start from the top of the screen
    height: SCREEN_HEIGHT * 0.9,
    width: '100%', // Ensures map takes full width
    marginTop: 0, // Push map down so it's not under the Searchbar
    marginBottom:0,
  },

  map: {
    flex: 1,
  },

  locationButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },

  bottomSheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  dragHandleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },

  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ccc',
  },

  listItem: {
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },  

  listContainer: {
    paddingBottom: 200, // Adjust this value to match your tab bar height
  },

  foodBankName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  foodBankDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },

  foodBankImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  downArrow: {
    position: 'absolute',
    left: 16, // Adjust based on desired spacing from the drag handle
    top: '50%',
    transform: [{ translateY: -12 }], // Center align vertically
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 16,
  },

  contactButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  
  websiteButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8, // Space between previous element and address
  },
  
  
});
