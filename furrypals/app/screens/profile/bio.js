import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  ScrollView,
  View,
  Pressable,
  Image,
  TextInput,
  Button,
  Alert,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import Carousel from "react-native-snap-carousel";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const bio = () => {
  const [userId, setUserid] = useState("");
  const [option, setOption] = useState("about");
  const [description, setDescription] = useState("");
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState([]);
  const [lookingOptions, setLookingOptions] = useState([]);

  // const profileImages = [ // grayed out as now pulling from db
  //   {
  //     image:
  //       "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1562&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  //   {
  //     image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //   },
  //   {
  //     image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  //   },

  // ];

  const data = [
    {
      id: "0",
      name: "Casual",
      description: "Let's keep it easy and see where it goes",
    },
    {
      id: "1",
      name: "Long Term",
      description: "How about a one life stand",
    },
    {
      id: "2",
      name: "Virtual",
      description: "Let's have some virtual fun",
    },
    {
      id: "3",
      name: "Open for Anything",
      description: "Let's Vibe and see where it goes",
    },
  ];

  // fetching the user who is updating their description - telling app who is logged in
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserid(userId);
    };
    fetchUser();
  }, []);

  // fetching all the information about the user that is on their about screen
  const fetchUserDecription = async () => {
    try {
      const response = await axios.get(`http://10.0.0.11:5000/users/${userId}`);
      const user = response.data;

      setDescription(user?.user?.description);
      setImages(user?.user.profileImages);
      setLookingOptions(user?.user.lookingFor);
      setImages(user?.user.profileImages);
    } catch (error) {
      console.log("Error fetching user information", error);
    }
  };

  // updating the user account information in real time
  useEffect(() => {
    if (userId) {
      fetchUserDecription();
    }
  }, [userId]);

  // updating description to the frontend
  const updateUserDescription = async () => {
    try {
      const response = await axios.put(
        `http://10.0.0.11:5000/users/${userId}/description`,
        { description: description }
      );

      if (response == 200) {
        Alert.alert("Success", "Description updated successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // updating the image to the front end
  const handelAddImage = async () => {
    try {
      const response = await axios.post(
        `http://10.0.0.11:5000/users/${userId}/profile-images`,
        { imageUrl: imageUrl }
      );
      console.log(response.data);
      if (response.status === 200) {
        Alert.alert("Success", "Photos saved successfully");
      }
      setImageUrl("");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Error updating photos");
    }
  };

  const renderImageCarousel = ({ item }) => (
    <View
      style={{ width: "100%", justifyContent: "center", alignItems: "center" }}
    >
      <Image
        source={images}
        style={{
          resizeMode: "cover",
          height: 200,
          borderRadius: 10,
          width: "85%",
          transform: [{ rotate: "-5deg" }],
        }}
      />
      <Text style={{ position: "absolute", top: 10, right: 2, color: "black" }}>
        {activeSlide + 1}/{images.length}
      </Text>
    </View>
  );

  // handeling the action of the functions defined below to add and remove lookingFor value
  const handelOption = (lookingFor) => {
    if (lookingOptions.includes(lookingFor)) {
      removeLookingFor(lookingFor);
    } else {
      addLookingFor(lookingFor);
    }
  };

  const addLookingFor = async (lookingFor) => {
    try {
      const response = await axios.put(
        `http://10.0.0.11:5000/users/${userId}/looking-for`,
        { lookingFor: lookingFor }
      );
      if (response.status == 200) {
        setLookingOptions([...lookingOptions, lookingFor]);
      }
      console.log(response);
    } catch (error) {
      console.log("Unable to add Looking For");
    }
  };

  const removeLookingFor = async (lookingFor) => {
    try {
      const response = await axios.put(
        `http://10.0.0.11:5000/users/${userId}/looking-for/remove`,
        { lookingFor: lookingFor }
      );
      if (response.status == 200) {
        setLookingOptions(lookingOptions.filter((item) => item !== lookingFor));
      }
    } catch (error) {
      console.log("Unable to remove Looking For");
    }
  };

  return (
    <LinearGradient colors={["#FDBB2D", "#22C1C3"]} style={{ flex: 1 }}>
      <ScrollView style={{ marginTop: 3 }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            marginTop: 4,
            marginLeft: 4,
            color: "#452817",
          }}
        >
          FurryPals
        </Text>
        <View>
          <View>
            <View>
              <Pressable
                style={{
                  backgroundColor: "#452817",
                  position: "absolute",
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: "auto",
                  marginRight: "auto",
                  width: 300,
                  left: "50%",
                  transform: [{ translateX: -150 }],
                  top: 35,
                  borderRadius: 10,
                }}
              >
                <Image
                  style={{ width: 50, height: 60, borderRadius: 20 }}
                  source={{
                    uri: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1562&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    marginTop: 6,
                    color: "white",
                  }}
                >
                  Buster
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    marginTop: 6,
                    color: "white",
                  }}
                >
                  I am 2 years old
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 180,
            marginHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 25,
            justifyContent: "center",
          }}
        >
          <Pressable onPress={() => setOption("about")}>
            <Text style={{ color: option == "about" ? "white" : "black" }}>
              About
            </Text>
          </Pressable>
          <Pressable onPress={() => setOption("photos")}>
            <Text style={{ color: option == "photos" ? "white" : "black" }}>
              Photos
            </Text>
          </Pressable>
          <Pressable onPress={() => setOption("looking for")}>
            <Text
              style={{ color: option == "looking for" ? "white" : "black" }}
            >
              Looking for
            </Text>
          </Pressable>
        </View>

        <View style={{ marginHorizontal: 14, marginVertical: 15 }}>
          {option == "about" && (
            <View
              style={{
                borderColor: "#452817",
                borderWidth: 1,
                padding: 10,
                borderRadius: 10,
                height: 300,
              }}
            >
              <TextInput
                value={description}
                onChangeText={(text) => setDescription(text)}
                multiline
                style={{
                  borderRadius: 10,
                  color: "white",
                  fontSize: description ? 17 : 17,
                }}
                placeholderTextColor={"white"}
                placeholder="Write about Pup"
              />
              <Pressable
                style={{
                  backgroundColor: "#452817",
                  marginTop: "auto",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 15,
                  borderRadius: 5,
                  justifyContent: "center",
                  padding: 10,
                }}
                onPress={updateUserDescription}
              >
                <Text
                  style={{ textAlign: "center", color: "white", fontSize: 20 }}
                >
                  Publish
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <View style={{ marginHorizontal: 14, marginTop: 2 }}>
          {option == "photos" && (
            <View>
              <Carousel
                data={images}
                renderItem={renderImageCarousel}
                sliderWidth={350}
                itemWidth={300}
                onSnapToItem={(index) => setActiveSlide(index)}
                style={{ borderWidth: 2 }}
              />
              <View style={{ marginTop: 2 }}>
                <Text style={{ fontSize: 20, color: "#452817", margin: 4 }}>
                  Add photos of pup
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    paddingVertical: 5,
                    borderRadius: 5,
                    marginTop: 10,
                    backgroundColor: "#DCDCDC",
                  }}
                >
                  <Entypo
                    style={{ marginLeft: 8 }}
                    name="image"
                    size={24}
                    color="gray"
                  />
                  <TextInput
                    value={imageUrl}
                    onChangeText={(text) => setImageUrl(text)}
                    placeholder="image url"
                    style={{ color: "gray", marginVertical: 10, width: 300 }}
                  />
                </View>
                <Button
                  onPress={handelAddImage}
                  style={{ marginTop: 5 }}
                  title="Add image"
                ></Button>
              </View>
            </View>
          )}
        </View>

        <View>
          {option == "looking for" && (
            <>
              <View>
                <FlatList
                  columnWrapperStyle={{ justifyContent: "space-between" }}
                  numColumns={2}
                  data={data}
                  renderItem={({ item }) => (
                    <Pressable
                      onPress={() => handelOption(item?.name)}
                      style={{
                        backgroundColor: lookingOptions.includes(item?.name)
                          ? "#FDBB2D"
                          : "#452817",
                        padding: 16,
                        justifyContent: "center",
                        alignItems: "center",
                        width: 150,
                        margin: 10,
                        borderRadius: 5,
                        borderColor: "white",
                        borderWidth: lookingOptions.includes(item?.name || "")
                          ? 0
                          : 2,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontWeight: "500",
                          fontSize: 13,
                          color: lookingOptions.includes(item?.name)
                            ? "#452817"
                            : "white",
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          color: lookingOptions.includes(item?.name)
                            ? "#452817"
                            : "white",
                          textAlign: "center",
                          width: 140,
                          marginTop: 10,
                          fontSize: 13,
                        }}
                      >
                        {item.description}
                      </Text>
                    </Pressable>
                  )}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default bio;
