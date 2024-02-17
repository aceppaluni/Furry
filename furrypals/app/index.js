import { StyleSheet, Text, View } from "react-native";
import React from 'react'
import { Redirect } from "expo-router";

const index = () => {
  return (
    <Redirect href='/signin/register'/>
    // make sure to change back when done with screen
  )
}
export default index

const styles = StyleSheet.create({});
