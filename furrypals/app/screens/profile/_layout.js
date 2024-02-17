import React from 'react'
import { Stack } from 'expo-router'

export default layout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name='bio'></Stack.Screen>
    </Stack>
  )
}


