import React from 'react'
import { Pressable, Text, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const gender = () => {
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

        <Pressable style={{backgroundColor: "white"}}>
            <Text>Next</Text>
        </Pressable>

    </SafeAreaView>
  )
}

export default gender
