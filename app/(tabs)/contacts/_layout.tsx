import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function ContactsLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDark ? '#000000' : '#F8F8F8',
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="import" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="[id]/new" />
      <Stack.Screen name="[id]/[entryId]" />
      <Stack.Screen name="[id]/archived" />
    </Stack>
  );
}