import React from 'react';
import { StyleSheet, View } from 'react-native';

interface Loading {
}

export default function Loading() {
  return (
    <View style={styles.container}>
    </View>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

