import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import * as Animatable from "react-native-animatable";

const Profile = ({ item, isEven, userId, setProfiles }) => {
  const colors = ["yellow", "green"];
  const [liked, setLiked] = useState(false);
  const [selected, setSelected] = useState(false);

  const handelLike = async (selectedUserId) => {
    // handeling first side
    try {
      setLiked(true);
      await axios.post("http://10.0.0.11:5000/send-like", {
        currentUserId: userId,
        selectedUserId: selectedUserId,
      });

      setTimeout(() => {
        setProfiles((prevProfiles) =>
          prevProfiles.filter((profile) => profile._id !== selectedUserId)
        );
        setLiked(false);
      }, 200);
      console.log("heart button of handel like function");
    } catch (error) {
      console.log("like function", error);
    }
  };

  const handelOtherSide = async (selectedUserId) => {
    // handling the second side if it NOT even from the if condition - part of the else block
    try {
      setSelected(true);
      await axios.post("http://10.0.0.11:5000/send-like", {
        currentUserId: userId,
        selectedUserId: selectedUserId,
      });

      setTimeout(() => {
        setProfiles((prevProfiles) =>
          prevProfiles.filter((profile) => profile._id !== selectedUserId)
        );
        setSelected(false);
      }, 200);
      console.log("heart button of handel other function");
    } catch (error) {
      console.log("other like function", error);
    }
  };

  if (isEven) {
    return (
      <View style={{ color: "brown", padding: 10 }}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 50 }}>
            <View>
              <Text style={{ fontSize: 17, fontWeight: "600" }}>
                {item?.name}
              </Text>
              <Text
                style={{
                  width: 200,
                  marginTop: 15,
                  fontSize: 18,
                  lineHeight: 24,
                  marginBottom: 4,
                }}
              >
                {item?.description?.length > 160
                  ? item?.description
                  : item?.description.substring(0, 160)}
              </Text>
            </View>

            {item?.profileImages?.slice(0, 1).map((item, index) => (
              <Image
                source={{ uri: item }}
                style={{
                  width: 280,
                  height: 280,
                  resizeMode: "cover",
                  borderRadius: 5,
                }}
              />
            ))}
          </View>
        </ScrollView>

        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <Entypo name="dots-three-vertical" size={26} color="black" />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
            >
              <Pressable
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "#E0E0E0",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome name="diamond" size={27} color="#DE3163" />
              </Pressable>
              {liked ? (
                <Pressable
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#E0E0E0",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Animatable.View
                    animation="swing"
                    easing={"ease-in-out-circ"}
                    iterationCount={1}
                  >
                    <AntDesign name="heart" size={27} color="red" />
                  </Animatable.View>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => handelLike(item?._id)}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#E0E0E0",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="hearto" size={27} color="#FF033E" />
                </Pressable>
              )}
            </View>
          </View>
        </View>
        <View style={{ marginVertical: 15 }} />
      </View>
    );
  } else {
    return (
      <View style={{ color: "brown", padding: 10 }}>
        <ScrollView showsHorizontalScrollIndicator={false} horizontal>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 50 }}>
            {item?.profileImages?.slice(0, 1).map((item, index) => (
              <Image
                style={{
                  width: 200,
                  height: 280,
                  resizeMode: "cover",
                  borderRadius: 5,
                }}
                source={{ uri: item }}
              />
            ))}
            <View>
              <Text style={{ fontSize: 17, fontWeight: "600" }}>
                {item?.name}
              </Text>
              <Text
                style={{
                  width: 200,
                  marginTop: 15,
                  fontSize: 18,
                  lineHeight: 24,
                  color: "#333333",
                  marginBottom: 8,
                  fontFamily: "Optima",
                }}
              >
                {item?.description}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 12,
            }}
          >
            <Entypo name="dots-three-vertical" size={26} color="black" />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
            >
              <Pressable
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: "#E0E0E0",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesome name="diamond" size={27} color="#DE3163" />
              </Pressable>

              {selected ? (
                <Pressable
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#E0E0E0",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Animatable.View
                    animation="swing"
                    easing={"ease-in-out-circ"}
                    iterationCount={1}
                  >
                    <AntDesign name="heart" size={27} color="red" />
                  </Animatable.View>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => handelOtherSide(item?._id)}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "#E0E0E0",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="hearto" size={27} color="#FF033E" />
                </Pressable>
              )}
            </View>
          </View>
        </View>
        <View style={{ marginVertical: 15 }} />
      </View>
    );
  }
};

export default Profile;
