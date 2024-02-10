import React from 'react'
import { Pressable, Text, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

const gender = () => {
  const router = useRouter()
  return (
    <SafeAreaView>

        <Pressable style={{backgroundColor: "white"}}>
            <Text>I am a Male</Text>
            <Image src={'#'}/>
        </Pressable>

        <Pressable style={{backgroundColor: "white"}}>
            <Text>I am a Female</Text>
            <Image src={'#'}/>
        </Pressable>

        <Pressable style={{backgroundColor: "white"}} onPress={router.replace('screens/profile')}>
            <Text>Next</Text>
        </Pressable>

    </SafeAreaView>
  )
}

export default gender
