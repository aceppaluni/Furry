import React, { useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import {useRouter } from 'expo-router'
import axios from 'axios'

const register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    //const [verified, setVerified] = useState(false)
    const router = useRouter();

    const handelRegister = () => {
        const user = {
            name: name,
            email: email,
            password: password,
            //verified: verified
        }

        axios.post('http://10.0.0.11:5000/register', user)
        .then((response) => {
            console.log(response)
            Alert.alert('Success', "Your pup has been registered!")
            setName('');
            setEmail('');
            setPassword('');
            //setVerified(true)
        })
        .catch((error) => {
            console.log(error)
            console.log(error.message);
            console.log(error.response);
            Alert.alert("Error", "Error registering your pup")
        })

    }

  return (
    <SafeAreaView style={{backgroundColor: "green", flexGrow: 10 }} >
        <Text style={styles.siteName}>FurryPals</Text>

        <Text style={styles.title}>Register</Text>
        
        <View style={{margin: 30}}>
            <Text style={{color: '#452817', fontSize: 18}}>Pups name:</Text>
            <TextInput placeholder='Pups name here' style={{backgroundColor: "white", height: 50}} value={name} onChangeText={(text) =>setName(text)} />
        </View>

        <View style={{margin: 30}}>
            <Text style={{color: '#452817', fontSize: 18}}>Email:</Text>
            <TextInput placeholder='Email' style={{backgroundColor: "white",  height: 50}} value={email} onChangeText={(text) => setEmail(text)} />
        </View>

        <View style={{margin: 30}}>
            <Text style={{color: '#452817', fontSize: 18}}>Password:</Text>
            <TextInput placeholder='Password' style={{backgroundColor: "white",  height: 50}} value={password} onChangeText={(text) => setPassword(text)} />
        </View>

        <View style={{margin: 38}}>
            <Pressable style={{backgroundColor: "white", borderColor: "black" ,padding: 5, marginTop: 20, height: 50}} onPress={handelRegister}>
                <Text style={{textAlign: 'center', marginTop: 8, fontSize: 22, color: '#452817'}}>Register</Text>
            </Pressable>
        </View>

        <Pressable onPress={() => router.replace('/signin/login')} style={{ marginTop: 20 }}>
            <Text style={{textAlign: "center", color: "#452817", fontSize: 20}}>Existing user</Text>
        </Pressable>
    </SafeAreaView>
  )
}

export default register

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