import { Stack } from "expo-router";

export default function layout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="register" />
        <Stack.Screen name="login" />
        <Stack.Screen name="gender" />
      </Stack>
    </>
  );
}

//for tab navigation
