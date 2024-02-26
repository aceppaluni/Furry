import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {FlatList, Text, View} from 'react-native'
import Profile from '../../components/profile'
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const users = () => {
  const [userId, setUserId] = useState('')
  const [user, setUser] = useState('')
  const [profiles, setProfiles] = useState([])

  useEffect(() => {
    const fetchUser = async() => {
      const token = await AsyncStorage.getItem('auth')
      const decodedToken = jwtDecode(token)
      const userId = decodedToken.userId
      setUserId(userId)
    };
    fetchUser();

  },[]);

  //console.log(userId)
  const fetchUserDecription = async () => {
    try {
      const response = await axios.get(`http://10.0.0.11:5000/users/${userId}`)
      const user = response.data
      setUser(user?.user)
      //console.log(response)
    } catch (error) {
      console.log('Error fetching user description', error)
    }
  }; // this console logs 

  const fetchUserProfiles = async () => {
    try {
      const response = await axios.get("http://10.0.0.11:5000/profiles", {
        params: {
          userId: userId,
          gender: user?.gender,
          lookingFor: user?.lookingFor,
        }
      });
      setProfiles(response.data.profiles)
      //console.log(response)
    } catch (error) {
      console.log(error)
    }
  }; 

  useEffect(() => {
    if(userId) {
      fetchUserDecription()
    }
  }, [userId]); 

  useEffect(() => {
    if(userId && user) {
      fetchUserProfiles()
    }
  }, [userId, user])

  console.log('profiles', profiles)
  return (
    <View style={{flex: 1}}>
       <FlatList data={profiles} renderItem={({ item, index }) => (
          <Profile
            key={index}
            item={item}
            userId={userId}
            setProfiles={setProfiles}
            isEven={index % 2 === 0}
          />
          )}
        />
    </View>
  )
}

export default users



