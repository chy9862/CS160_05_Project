import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';



const Login = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (username === 'Admin' && password === 'Password') {
            try {
                await SecureStore.setItemAsync('isLoggedIn', 'true');
                console.log('SecureStore set isLoggedIn to true');
                router.replace('/(tabs)');
            } catch (error) {
                console.error('Error setting SecureStore:', error);
            }
        } else {
            alert('Invalid username or password');
        }
    };
    

    useEffect(() => {
        const testAsyncStorage = async () => {
            try {
                await AsyncStorage.setItem('testKey', 'testValue');
                const value = await AsyncStorage.getItem('testKey');
                console.log('AsyncStorage test value:', value); // Should log 'testValue'
            } catch (error) {
                console.error('AsyncStorage test failed:', error);
            }
        };
        testAsyncStorage();
    }, []);

    return (
        <View style={styles.container}>
            
            <Image
                source={require('../assets/images/FoodHero_FoodHero_Partners_with_Empire_Company_Limited_to_Combat.jpg')}
                style={{ width:800, height: 150 }} // Adjust the width and height of the logo
                resizeMode="contain"
              />

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sign_up_button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },

    sign_up_button: {
        width: '100%',
        height: 50,
        backgroundColor: '#bfbfbf',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
