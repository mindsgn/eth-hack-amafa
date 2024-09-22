import React from 'react';
import { StyleSheet, View } from 'react-native';
import List from '@/components/tags';
import { useRouter } from 'expo-router';
import Button from '@/components/button';
import { useAuth } from '@/context/authContext';

export default function Tags() {
  return (
    <View style={styles.container}>
      <List />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "none",
    display:  "flex",
    flexDirection: "column",
    alignItems:"center",
  },
});