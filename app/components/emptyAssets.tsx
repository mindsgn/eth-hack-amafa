import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, Text, Dimensions } from 'react-native';

interface EmptyAssetsCard {
  title?: string,
  text?: string
}

const height = Dimensions.get('window').height;


export default function EmptyAssetsCard(
  {
    title = "No assets on database",
    text = "What are you waiting for? Create your first asset now!"
  }
) {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
    //@ts-expect-error
    height,
    display: "flex",
    justifyContent: "center"
  },
  title:{
    fontSize: 20,
    fontWeight:"bold",
    textAlign: "center"
  },
  text:{
    fontWeight:"bold",
    textAlign: "center"
  }
});