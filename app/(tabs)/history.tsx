import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HistoryScreen() {
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Text style={styles.title}>History Logbook</Text>
            <Text style={styles.placeholder}>No stories unlocked yet.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingHorizontal: 20,
    },
    title: {
        fontFamily: 'YoungSerif',
        fontSize: 32,
        color: Colors.text,
        marginBottom: 20,
        marginTop: 20,
    },
    placeholder: {
        fontFamily: 'Inter',
        color: Colors.textMuted,
        fontSize: 16,
    },
});
