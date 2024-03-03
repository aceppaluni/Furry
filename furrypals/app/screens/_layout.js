import { Tabs } from "expo-router";
import React from "react";

export default function layout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="profile"></Tabs.Screen>
      <Tabs.Screen name="chat"></Tabs.Screen>
      <Tabs.Screen name="users"></Tabs.Screen>
    </Tabs>
  );
}
