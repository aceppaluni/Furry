import {Stack} from 'expo-router'
export default layout = () => {
    return (
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name='chat'></Stack.Screen>
      </Stack>
    )
  }