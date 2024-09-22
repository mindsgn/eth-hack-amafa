import React from 'react';
import { StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';

const width = Dimensions.get("window").width

interface Button {
  onPress: () => void,
  title: string,
  background?: string
}

export default function Button({ onPress, title, background = "black" }: Button) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, { backgroundColor: background}]}>
        <Text 
          style={styles.text}>
          {title}
        </Text>
      </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  button:{
    paddingVertical: 20,
    alignItems:"center",
    display: "flex",
    justifyContent: "center",
    backgroundColor: 'black',
    width: width - 20,
    borderRadius: 10
  },
  text:{
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  }
});