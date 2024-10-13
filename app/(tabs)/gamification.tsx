import { Text, View, StyleSheet } from 'react-native';

export default function MealPlanningScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About Gamification</Text>
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
  },
});
