import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { hexToRGBA } from '@/hooks/hexToRGBA';

interface Tag {
    name?: string;
    color?: string;
}

export default function Tag(
    {
        name="",
        color="#2A2A2A",
    } : Tag
) {
  const bgColor = hexToRGBA(color, 0.1);
  const textColor = hexToRGBA(color, 1);

  return (
    <View style={[styles.container ,{ backgroundColor: bgColor }]}>
        <View style={[styles.circle, { backgroundColor: `${textColor}` }]}/>
        <Text style={[styles.text, { color: textColor }]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    display: 'flex',
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    padding: 2,
    minWidth: 100,
    borderRadius: 30,
  },
  circle:{
    width: 10,
    height: 10,
    backgroundColor: "rgba(255, 0, 0, 1)",
    marginHorizontal: 5,
    borderRadius: 50,
  },
  text:{
     color: "rgba(255, 0, 0, 1)",
     fontSize: 16,
     marginHorizontal: 5,
     fontWeight: "bold"
  }
});