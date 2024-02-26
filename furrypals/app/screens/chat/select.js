import React from 'react'
import { Pressable, StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import axios from "axios";

const select = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const profiles = JSON.parse(params?.profiles);

  const userId = params?.userId; 

  console.log('profiles', profiles)

  const handelMatch = async (selectedUserId) => {
    try {
      await axios.post('http://10.0.0.11:5000/create-match', {
        currentUserId: userId,
        selectedUserId: selectedUserId,
      }); 

      setTimeout(() => {
        router.push('screens/chat/chatroom')
      }, 500);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ScrollView style={{backgroundColor: 'green', flex: 1, padding: 10}}>
     <View style={{flexDirection: 'row', alignItems: 'center', gap: 14}}>
      <View style={{backgroundColor: '#452817', padding: 10, borderRadius: 18}}>
        <Text style={{ textAlign: "center", fontFamily: "Optima", color: 'white' }}>NearBy</Text>
      </View>
      <View style={{backgroundColor: '#452817', padding: 10, borderRadius: 18}}>
        <Text style={{ textAlign: "center", fontFamily: "Optima" , color: 'white'}}>Looking For</Text>
      </View>
     </View>

     {profiles?.length > 0 ? (
     <View style={{marginTop: 20}}>
      {profiles?.map((item, index) => (
        <View style={{marginVertical: 15}}>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 50}}>
              <View>
                <Text style={{ fontSize: 17, fontWeight: "600", color: '#452817' }}>{item?.name}</Text>
                <Text style={{
                  width: 200, color: '#452817', marginTop: 15, fontSize: 18, lineHeight: 24, marginBottom: 8, }}>
                  {item?.description?.length > 160 ? item?.description : item?.description.substr(0, 160)}
                </Text>
              </View>

              {item?.profileImages?.slice(0, 1).map((item, index) => (
                <Image style={{width:200, height:200, resizeMode: 'cover', borderRadius: 5 }} source={{ uri: item }}/>
              ))}
            </View>
          </ScrollView>

          <View>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12}}>
              <Entypo name="dots-three-vertical" size={26} color="black" />
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
                <Pressable style={{width: 50, height: 50, borderRadius: 25, backgroundColor: 'pink', justifyContent: 'center', alignItems: 'center'}}>
                  <FontAwesome name="diamond" size={27} color="#DE3163" />
                </Pressable>
                <Pressable onPress={() => handelMatch(item._id)} style={{
                  width: 50, height: 50, borderRadius: 25, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'
                }} >
                  <AntDesign name="hearto" size={27} color="#FF033E" />
                </Pressable>
              </View>
            </View>
          </View>

          <View>
            <Text style={{color: 'white'}}>Looking For</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10}}>
              {item?.lookingFor?.map((item, index) => (
                <View style={{backgroundColor: '#452817', padding: 10, borderRadius: 22}}>
                  <Text style={{ textAlign: "center", color: "white", fontWeight: "500", fontFamily: "Optima",}}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      ))}
     </View>
    ) : (
     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100}}>
      <Image style={{width: 100, height: 100}} source={{uri: "https://cdn-icons-png.flaticon.com/128/1642/1642611.png" }} />
      <View>
        <Text style={{ fontSize: 15, marginTop: 10, fontFamily: "Georgia-Bold", textAlign: "center"}}>Uh Ho</Text>
        <Text style={{ fontSize: 15, marginTop: 10, fontFamily: "Georgia-Bold",textAlign: "center"}}>No likes yet</Text>
        <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "600", textAlign: "center" }}>Improve your AD to get more!</Text>
      </View>
     </View>
     )}
    </ScrollView>
  )
}

export default select

