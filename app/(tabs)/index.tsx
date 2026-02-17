import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.header}>The Campfire</Text>
      <View style={styles.fireContainer}>
        {/* Fire Circle will go here */}
        <Text style={styles.placeholderLabel}>🔥</Text>
        <Text style={styles.placeholderText}>Gathering Friends...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  header: {
    fontFamily: 'YoungSerif',
    fontSize: 34,
    color: Colors.primary, // Ember Orange
    marginTop: 20,
  },
  fireContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderLabel: {
    fontSize: 80,
    marginBottom: 20,
  },
  placeholderText: {
    fontFamily: 'Inter',
    color: Colors.textMuted,
    fontSize: 16,
  }
});