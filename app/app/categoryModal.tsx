import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, Text, TouchableOpacity, View, Image, useWindowDimensions, ScrollView } from 'react-native';
import Button from '@/components/button';
import DropDown from '@/components/dropDown';
import { categories } from '@/constants/category';
import { currencies } from '@/constants/currencies';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAsset } from '@/context/assetContext';
import { useAuth } from '@/context/authContext';
import * as Location from 'expo-location'

interface Form {
  name: string,
  images: File[],
  category: {
    name: string,
    description: string,
    color: string
  } | null,
  price: number,
  currency: string
  owner: "DEBUG"
}
// const height = Dimensions.get('window').height;

export default function Modal() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const {isAuth} = useAuth();
  const { getAssets } = useAsset()
  const navigation = useNavigation();
  const route = useRoute();
  //@ts-expect-error
  const imagePath = route.params?.imagePath || null;
  const router = useRouter();
  const [formData, setFormData] = useState<Form>({
    name: "",
    images: [],
    category: null,
    price: 0,
    currency: "ZAR",
    owner: "DEBUG"
  });

  const handleSubmit = async() => {
    const formDataToSend = new FormData();

    try{
      const { name, category, price, currency, owner } = formData

      formDataToSend.append("data", JSON.stringify({
        name,
        category,
        value: price,
        currency,
        owner,
      }))
      
      if (imagePath) {
        const fileInfo = await FileSystem.getInfoAsync(imagePath);
        if (fileInfo.exists) {
          formDataToSend.append('images', {
            uri: imagePath,
            name: 'image.jpg',
            type: 'image/jpeg'
          } as any);
        }
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/asset/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${isAuth?.token}`
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await response.json();
      await getAssets();
      navigation.goBack();
    }catch(error){
      console.error('Error submitting form:', error);
    }
  };


  const openCamera = () => {
    router.push('/camera');
  };

  useEffect(() => {
    if(imagePath){
      setFormData({...formData, images:[ imagePath ]})
    }
  },[imagePath]);

  useEffect(() => {
    // userLocation();
  }, []);

  return (
    <ScrollView 
      contentContainerStyle={[styles.container]}>
      <View style={styles.form}>
        <Text style={styles.title}>{'Add New Asset'}</Text>
        <Text style={styles.label}>{'Name'}</Text>
        <TextInput
          value={formData.name}
          autoCapitalize={"sentences"}
          onChangeText={(name: string) => {
            setFormData({ ...formData, name })
          }}
          style={styles.input}
          placeholder="Enter asset title"
        />
        <Text style={styles.label}>{'Image'}</Text>
        {
          imagePath ?
          <View style={styles.imageContainer}>
          <Image source={{ uri: imagePath }} style={styles.image} />
          <TouchableOpacity onPress={openCamera} style={styles.changeImageButton}>
            <Text style={styles.changeImageText}>Change Image</Text>
          </TouchableOpacity>
        </View>
          :
            <TouchableOpacity
              onPress={openCamera}
              style={styles.imageInput}
            >
              <Text style={styles.label}>{'Click here to change image'}</Text>
            </TouchableOpacity>
        }
       
        <Text style={styles.label}>{'Category'}</Text>
        <DropDown 
          placeholder='Select Category'
          //@ts-expect-error
          list={categories}
          //@ts-expect-error
          onSelect={(data: { name: string, color: string, description: string }) => {
            const { name, color, description} = data;
            setFormData({...formData, category: { name, color, description} })
          }}
        />
        <Text style={styles.label}>{'Price'}</Text>
        <View
          style={styles.price}>
          <DropDown 
            placeholder='Select Currency'
            //@ts-expect-error
            list={currencies}
            //@ts-expect-error
            onSelect={(data: { name: string }) => {
              setFormData({...formData, currency: data?.name })
            }}
            width={200}
          />
          <TextInput
            value={`${formData.price}`}
            onChangeText={(price: string) => {
              
              if(price===""){
                price = "0"
              }

              setFormData({ ...formData, price: parseFloat(price) })
            }}
            style={[styles.input,
              {
                width: 100,
                height: 50,
                backgroundColor: '#E9ECEF',
                borderRadius: 12,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 12,
                marginBottom: 10,
                fontSize: 28,
              }
            ]}
            keyboardType="numeric"
            placeholder="Enter asset title"
          />
        </View>
      </View>
      <Button onPress={handleSubmit} title="Add"/>
    </ScrollView>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 20,
    borderRadius: 4,
  },
  price:{
    display: "flex",
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  form:{
    flex: 1,
    width: "100%",
    padding: 10,
  },
  imageInput:{
    display: 'flex',
    flexDirection:"column",
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0, 0.2)",
    borderRadius: 10, 
    width: "100%",
    marginBottom: 10,
    height: 200,
  },
  title:{
    fontSize: 28,
    marginBottom: 10,
    fontWeight: "bold"
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 5,
  },
  changeImageText: {
    color: 'white',
    fontSize: 14,
  },
});

