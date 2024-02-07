import React, { useState, useEffect} from 'react'
import { SafeAreaView} from 'react-native-safe-area-context'
import {Text, StyleSheet, TextInput, Pressable, View} from 'react-native'
import {useRouter } from 'expo-router'
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios'


const login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const token = await AsyncStorage.getItem('auth')

                if(token) {
                    router.replace('/screens/profile')
                }

            } catch (error) {
                console.log('Error')
            }
        }
        checkLogin()
    })
    
    const handelLogin = () => {
        const user = {
            email: email,
            password: password
        }

        axios.post('http://localhost:5000/login', user)
        .then((response) => {
            const token = response.data.token;
            AsyncStorage.setItem('auth', token)
            router.replace('/signin/gender')
        })
        .catch((error) => {
            console.log("Error occured", error)
        })
    }

  return (
  <SafeAreaView style={{backgroundColor: "green", flexGrow: 5 }} >
    <Text style={styles.siteName}>FurryPals</Text>

    <Text style={styles.title}>Login</Text>

    <View style={{margin: 38}}>
        <Text style={{color: '#452817', fontSize: 18, margin: 5}}>Email:</Text>
        <TextInput placeholder='Email' style={{backgroundColor: "white",  height: 50}} value={email} onChangeText={(text) => setEmail(text)} />
    </View>

    <View style={{margin: 38}}>
        <Text style={{color: '#452817', fontSize: 18, margin: 5}}>Password:</Text>
        <TextInput placeholder='Password' style={{backgroundColor: "white",  height: 50}} value={password} onChangeText={(text) => setPassword(text)} />
    </View>

    <View style={{margin: 38}}>
        <Pressable style={{backgroundColor: "white", borderColor: "black" ,padding: 5, marginTop: 20, height: 50}} onPress={handelLogin}>
            <Text style={{textAlign: 'center', marginTop: 8, fontSize: 22, color: '#452817'}}>Login</Text>
        </Pressable>
    </View>

    <Pressable onPress={() => router.replace('/signin/register')} style={{ marginTop: 20}}>
        <Text style={{textAlign: "center", color: "#452817", fontSize: 20}}>New user</Text>
    </Pressable>
  </SafeAreaView>
  )
}

export default login

const styles = StyleSheet.create({
    siteName: {
        fontSize: 32,
        color: '#452817',
        margin: 5
    },
    title: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
        color: '#452817'
    },
    gradient: { 
        backgroundColor: 'linear-gradient(#22C1C3, #FDBB2D )'
    }
})
