import {Stack} from 'expo-router'
export default layout = () => {
    return (
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name='users'></Stack.Screen>
      </Stack>
    )
  }