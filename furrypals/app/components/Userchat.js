import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

const Userchat = ({ item, userId }) => {
  const router = useRouter();
  const [messages, setMessages] = useState([]);

  const getLastMessage = () => {
    const n = messages.length;

    return messages[n - 1];
  };

  const lastMessage = getLastMessage();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const senderId = userId;
      const receiverId = item?._id;
      const response = await axios.get("http://10.0.0.11:5000/messages", {
        params: { senderId, receiverId },
      });
      //console.log( 'me',senderId)
      //console.log('pr', receiverId)
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "screens/chat/chatroom",
          params: {
            image: item?.profileImages[0],
            name: item?.name,
            receiverId: item?._id,
            senderId: userId,
          },
        })
      }
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginVertical: 12,
      }}
    >
      <View>
        <Image
          source={{ uri: item?.profileImages[0] }}
          style={{ width: 60, height: 60, borderRadius: 35 }}
        />
      </View>

      <View>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "500",
            marginTop: 6,
            color: "white",
          }}
        >
          {item?.name}
        </Text>
        <Text style={{ color: "white" }}>
          {lastMessage
            ? lastMessage?.message
            : `Start the chat with ${item?.name}`}
        </Text>
      </View>
    </Pressable>
  );
};

export default Userchat;
