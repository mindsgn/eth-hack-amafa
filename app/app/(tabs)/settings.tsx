import React from 'react';
import { StyleSheet, View } from 'react-native';
import Assets from '@/components/assets';
import { useRouter } from 'expo-router';
import Button from '@/components/button';
import { useAuth } from '@/context/authContext';

export default function Settings() {
  const { logout } = useAuth(); 


  return (
    <View style={styles.container}>
      <Button 
        title="LOGOUT" 
        background='red'
        onPress={() => {
          logout()
        }}/>
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