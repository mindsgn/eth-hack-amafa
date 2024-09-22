import React from 'react';
import { StyleSheet, View } from 'react-native';
import CategoryList from '@/components/category';
import { useRouter } from 'expo-router';
import Button from '@/components/button';
import { useAuth } from '@/context/authContext';

export default function Category() {
  return (
    <View style={styles.container}>
      <CategoryList />
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