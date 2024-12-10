import React, { useState } from 'react';
import { Text, View, ScrollView, SafeAreaView, StyleSheet, TextInput } from 'react-native';

export default function GamificationScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock user data
  const users = [
    { id: '1', name: 'User', score: 120 },
    { id: '2', name: 'Alice', score: 100 },
    { id: '3', name: 'Bob', score: 90 },
    { id: '4', name: 'Charlie', score: 80 },
    { id: '5', name: 'Dana', score: 70 },
  ];

  // Filter users based on the search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search leaderboard"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Leaderboard List */}
      <ScrollView>
        <View style={styles.leaderboardList}>
          {filteredUsers.map((user, index) => {
            // Determine border color based on rank
            const borderColor =
              index === 0
                ? '#ffd700' // Gold
                : index === 1
                ? '#99c2d6' // Blueish silver
                : index === 2
                ? '#cd7f32' // Bronze
                : '#d9d9d9'; // White-tinted gray

            return (
              <View
                key={user.id}
                style={[
                  styles.userBox,
                  { borderColor: borderColor },
                ]}
              >
                <View style={styles.userInfo}>
                  <Text style={styles.rank}>{index + 1}.</Text>
                  <Text style={styles.name}>{user.name}</Text>
                </View>
                <Text style={styles.score}>{user.score} pts</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d6f5ff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  leaderboardList: {
    padding: 10,
    alignItems: 'center', // Center align items in the list
  },
  userBox: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 5, // Thicker border for emphasis
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4, // For Android shadow
    alignItems: 'center', // Center content inside the box
  },
  userInfo: {
    flexDirection: 'row', // Align rank and name in a row
    alignItems: 'center',
    marginBottom: 5, // Space between name and points
  },
  rank: {
    fontSize: 24, // Larger font for the rank
    fontWeight: 'bold',
    color: '#007acc',
    marginRight: 8, // Space between rank and name
  },
  name: {
    fontSize: 24, // Larger font for the name
    fontWeight: 'bold',
    color: '#030303',
  },
  score: {
    fontSize: 18, // Smaller font for the points
    color: '#009900',
  },
});
