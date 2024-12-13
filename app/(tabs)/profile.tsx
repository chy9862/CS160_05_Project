import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store'; // For managing login state
import { useRouter } from 'expo-router'; // For navigation

export default function AboutScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('isLoggedIn'); // Clear login state
      console.log('User logged out successfully');
      router.replace('/login'); // Redirect to login screen
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View style={styles.container}>

      {/* Log Out Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d6f5ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#030303',
    fontSize: 18,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
