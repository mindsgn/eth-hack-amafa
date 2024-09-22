import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface Title {
  text: string;
}

export default function Title({ text }: Title) {
    return (
      <Text 
        style={
          [
            styles.text, 
            { fontFamily: 'SF-Bold' }
          ]
        }>
        {text}
      </Text>
    );
}

const styles = StyleSheet.create({
  text:{
    fontSize: 28,
    color: "black",
    fontWeight: "bold",
  }
});