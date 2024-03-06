import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import UserChat from "../../components/Userchat";
import { LinearGradient } from "expo-linear-gradient";

const index = () => {
  const router = useRouter();
  const [userId, setUserId] = useState();
  const [matches, setMatches] = useState([]);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUser();
  }, []);

  const fetchRecievedLikesDetails = async () => {
    try {
      const response = await axios.get(
        `http://10.0.0.11:5000/received-likes/${userId}/details`
      );

      const receivedLikesDetails = response.data.receivedLikesDetails;

      setProfiles(receivedLikesDetails);
      //console.log('like details', receivedLikesDetails)
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserMatches = async () => {
    try {
      const response = await axios.get(
        `http://10.0.0.11:5000/users/${userId}/matches`
      );

      const userMatches = response.data.matches;

      setMatches(userMatches);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRecievedLikesDetails();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUserMatches();
    }
  }, [userId]);

  useFocusEffect(
    // for navigation
    // callback preventing unnccessary re-renders of components relying on callback functions - used for optimization
    useCallback(() => {
      if (userId) {
        // entire function helps optimazation and performance as well as user navigaton
        fetchUserMatches();
      }
    }, [])
  );

  //console.log('matches', matches)
  return (
    <LinearGradient colors={["#FDBB2D", "#22C1C3"]} style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
            Chats
          </Text>
          <Ionicons name="chatbox-ellipses-outline" size={25} color="white" />
        </View>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "screens/chat/select",
              params: {
                profiles: JSON.stringify(profiles),
                userId: userId,
              },
            })
          }
          style={{
            marginVertical: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: "#E0E0E0",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="heart" size={24} color="black" />
          </View>
          <Text
            style={{ fontSize: 17, marginLeft: 10, flex: 1, color: "white" }}
          >
            You have got {profiles?.length} likes
          </Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </Pressable>

        <View>
          {matches?.map((item, index) => (
            <UserChat key={index} item={item} userId={userId} />
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

export default index;
