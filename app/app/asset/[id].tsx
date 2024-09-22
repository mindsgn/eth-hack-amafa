import React from 'react';
import { View, ScrollView, Text, Image, StyleSheet } from 'react-native';
import {  useLocalSearchParams } from 'expo-router';
import Button from '@/components/button';
import { useNavigation } from '@react-navigation/native';
import { useAsset } from '@/context/assetContext';
import { Tag } from '@/components';
import { hexToRGBA } from '@/hooks/hexToRGBA';
import MapView, { Marker } from 'react-native-maps';
import truncateEthAddress from 'truncate-eth-address'

export default function AssetDetails() {
  const navigation = useNavigation();
  const { removeAsset } = useAsset();
  const local = useLocalSearchParams();
  const { image, name, category, owner, id, value, color } = local;
   
  const removeItem  = async() =>  {
    try{
      await removeAsset(`${id}`);
      navigation.goBack();
    }catch(error){
      console.log(error)
    }
  }

  return (
    <ScrollView
      style={styles.container}>
      <Image
        source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}/uploads/${image}` }} 
        style={styles.image} />
      <View
        style={styles.details}>
        <View
          style={{paddingLeft: 10,}}>
          <Text style={styles.title}>{name}</Text>
        </View>
        <View style={styles.moreDetails}>
          <View style={styles.row}>
            <Text style={[styles.title, {  }]}>{"Category"}</Text>
            <Tag name={`${category}`} color={`${color}`} />
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>{"Owner"}</Text>
            <Tag name={`${truncateEthAddress(`${owner}`)}`} />
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>{"Custodain"}</Text>
            <Tag name={`${truncateEthAddress(`${owner}`)}`} />
          </View>
          <View style={styles.row}>
            <Text style={styles.title}>{"Value"}</Text>
            <Text style={styles.title}>{value}</Text>
          </View>
          <MapView 
             scrollEnabled={false}
            style={{flex: 1, marginVertical: 10, height: 350}}
            initialRegion={{
              latitude: -33.918861,
              longitude:18.423300,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            <Marker
              coordinate={{latitude: -33.918861, longitude: 18.423300}}
              title={""}
              description={""}
            />
          </MapView>
        </View>
      </View>
      
      <View style={styles.buttons}>
        <Button onPress={() => {removeItem()}} title='Remove Asset' background='red'/>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: hexToRGBA("#2A2A2A", 0.4)
  },
  text: {
    fontSize: 24,
    color: hexToRGBA("#2A2A2A", 0.1)
  },
  details:{
    flex: 1,
    display: "flex",
    paddingTop: 20
  },
  moreDetails:{
    flex: 1,
    borderTopWidth: 1,
    marginTop: 10,
    borderTopColor:'rgba(0 , 0, 0, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  buttons:{
    marginVertical: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width: '100%',
    height: 300,
  },
  row:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  }
});