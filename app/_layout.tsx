import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'CBE Services', headerTitleAlign: 'center' }} />
      <Stack.Screen name="service/[id]" options={{ title: 'Service Detail', headerTitleAlign: 'center' }} />
    </Stack>
  );
}