import React from 'react';
import { StyleSheet, View } from 'react-native';
import Assets from '@/components/assets';
import { useRouter } from 'expo-router';
import Button from '@/components/button';

export default function Home() {
  const router = useRouter();

  const openAddAssetModal = () => {
    router.push('/modal');
  };

  return (
    <View 
      style={styles.container}>
      <Assets />
      <View 
        style={styles.addContainer}>
        <Button onPress={openAddAssetModal} title="Add Assets"/>
      </View>
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
    justifyContent: "center",
  },
  card: {
    height: 140,
    width: "100%",
    marginVertical: 10,
  }, 
  addContainer: {
    position: "absolute",
    backgroundColor: "none",
    bottom: 0,
    height: 100,
    width: "100%",
    display: "flex",
    alignItems:"center",
    justifyContent: "center",
    flexDirection: "column",
    marginVertical: 10,
    borderRadius: 10,
  },
  button:{
    paddingVertical: 20,
    alignItems:"center",
    display: "flex",
    justifyContent: "center",
    backgroundColor: 'black',
    width: "90%",
    borderRadius: 10
  },
  text:{
    color: "white",
  }
});