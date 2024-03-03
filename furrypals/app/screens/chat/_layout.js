import { Stack } from "expo-router";

export default layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen
        name="select"
        options={{ headerShown: false }}
      ></Stack.Screen>
      <Stack.Screen name="chatroom" />
    </Stack>
  );
};
