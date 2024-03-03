import { Text, View, Pressable, Image, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const gender = () => {
  const [option, setOption] = useState("");
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };
    fetchUser();
  }, []);

  const heandleGender = async () => {
    try {
      const response = await axios.put(
        `http://10.0.0.11:5000/users/${userId}/gender`,
        {
          gender: option,
        }
      );

      console.log(response.data);

      if (response.status == 200) {
        router.replace("screens/profile/bio");
      }
    } catch (error) {
      console.log(error, "error occured while updating gender");
      Alert.alert("Error", "Unable to update gender");
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "green", flexGrow: 10 }}>
      <Pressable
        onPress={() => setOption("male")}
        style={{
          backgroundColor: "white",
          margin: 10,
          height: 80,
          borderColor: option === "male" ? "brown" : "transparent",
          borderWidth: option == "male" ? 1 : 0,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            marginLeft: 10,
            marginTop: 20,
            color: "brown",
          }}
        >
          I am a Male
        </Text>
        <Image src={"#"} />
      </Pressable>

      <Pressable
        onPress={() => setOption("female")}
        style={{
          backgroundColor: "white",
          margin: 10,
          height: 80,
          borderColor: option === "female" ? "brown" : "transparent",
          borderWidth: option == "female" ? 1 : 0,
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            marginLeft: 10,
            marginTop: 20,
            color: "brown",
          }}
        >
          I am a Female
        </Text>
        <Image src={"#"} />
      </Pressable>

      {option && (
        <View style={{ marginTop: 60 }}>
          <Pressable
            onPress={heandleGender}
            style={{
              backgroundColor: "white",
              margin: 20,
              height: 60,
            }}
          >
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                marginTop: 10,
                textAlign: "center",
                color: "brown",
              }}
            >
              Done
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

export default gender;
