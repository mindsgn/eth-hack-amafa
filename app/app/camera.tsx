import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import Button from '@/components/button';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

const width = Dimensions.get('window').width;
const  facing = 'back';

export default function Camera() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Camera Permission" />
      </View>
    );
  }

  const snap = async() => {
    try{
      if (cameraRef.current) {
        //@ts-expect-error
        const photo = await cameraRef.current.takePictureAsync();
       

        const fileName = `photo_${Date.now()}.jpg`;
        const newPath = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.moveAsync({
          from: photo.uri,
          to: newPath
        });
        
        //@ts-expect-error
        navigation.navigate('modal', { imagePath: newPath });
      }
    }catch(error){
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={snap} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: 'center',
    paddingBottom: 10,
  },
  text: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    width,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 35
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 90,
    height: 90,
    borderWidth: 5,
    borderColor: "white",
    padding: 4,
    borderRadius: 100
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: "red",
    borderRadius: 100
  },
});

