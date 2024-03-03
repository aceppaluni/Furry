import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Entypo, Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { io } from "socket.io-client";
import axios from "axios";

const chatroom = () => {
  const [message, setMessage] = useState("");
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState([]);

  const socket = io("http://10.0.0.11:8000");

  socket.on("connect", () => {
    console.log("connected to socket.ID server");
  });

  socket.on("receiveMessage", (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  });

  const sendMessage = async (senderId, receiverId) => {
    socket.emit("sendMessage", { senderId, receiverId, message });

    setMessage("");

    //callling to see the UI update
    setTimeout(() => {
      fetchMessages();
    }, 200);
    //console.log('message', message)
  };

  const fetchMessages = async () => {
    try {
      const senderId = params?.senderId;
      const receiverId = params?.receiverId;

      const response = await axios.get("http://10.0.0.11:5000/messages", {
        params: { senderId, receiverId },
      });

      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              source={{ uri: params?.image }}
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                resizeMode: "cover",
              }}
            />
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {params?.name}
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color="black"
          />
          <Ionicons name="videocam-outline" size={24} color="black" />
        </View>
      ),
    });
  }, []);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {messages.map((item, index) => (
          <Pressable
            style={[
              item?.senderId === params?.senderId
                ? {
                    alignSelf: "flex-end",
                    backgroundColor: "blue",
                    padding: 8,
                    borderRadius: 7,
                    margin: 10,
                  }
                : {
                    alignSelf: "flex-start",
                    backgroundColor: "pink",
                    padding: 8,
                    borderRadius: 7,
                    margin: 10,
                    maxWidth: "60%",
                  },
            ]}
          >
            <Text
              style={{
                fontSize: 13,
                textAlign: "left",
                color: "white",
                fontWeight: "500",
              }}
            >
              {item?.message}
            </Text>
            <Text
              style={{
                fontSize: 9,
                textAlign: "right",
                color: "#F0F0F0",
                marginTop: 5,
              }}
            >
              {formatTime(item?.timestamp)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: 1,
        }}
      >
        <Entypo
          style={{ marginRight: 7 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type your message..."
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginHorizontal: 8,
          }}
        >
          <Entypo name="camera" size={24} color="gray" />
          <Feather name="mic" size={24} color="gray" />
        </View>
        <Pressable
          onPress={() => sendMessage(params?.senderId, params?.receiverId)}
          style={{
            backgroundColor: "#007bff",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default chatroom;
