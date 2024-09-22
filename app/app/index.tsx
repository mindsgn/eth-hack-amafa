import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, Dimensions } from 'react-native';
import { useRouter, useRootNavigationState} from 'expo-router';
import { useAuth } from '@/context/authContext';
import Button from '@/components/button';
import Title from '@/components/title';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height

export default function Home() {
  const { getAuth} = useAuth();
  const [ email, setEmail ] = useState<string>("");
  const [ code, setCode ] = useState<string>("");
  const [ step, setStep ] = useState<number>(0);
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  const getAuthentication = async() => {
    try{
      const isAuth = await getAuth();
      if(isAuth){
        router.replace("/(tabs)")
      }
    }catch(error: any){
      return null
    }
  };

  const login = async() => {
    try{
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase(),
        })
      })

      if(!response.ok){
        throw new Error("signin failed");
      }

      setStep(step+1)
    }catch(error){
      console.log(error)
    }
  }

  const verify = async() => {
    try{
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/verify`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code
        })
      })      

      if(!response.ok){
        throw new Error("verfification failed");
      }

      const data  = await response.json()
      const { token } = data 

      await AsyncStorage.setItem('auth', JSON.stringify({
        token,
        email: email.toLowerCase(),
      }));

      getAuthentication()

    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    if (!rootNavigationState?.key) return;
    getAuthentication();
  }, [rootNavigationState?.key])

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: "black", flex: 1}}/>
      {
        step == 0 ? (
          <View style={styles.onboarding}>
            <View style={styles.row}>
              <Title text={"LOGIN"}/>
            </View>
            <TextInput
              value={email}
              onChangeText={(text: string) => { setEmail(text) }}
              style={styles.onboardingInput}
              placeholder='email'
            />
            <Button 
              onPress={() => {login()}}
              title='Login' />
          </View>
        ) : (
          <View style={styles.onboarding}>
            <View style={styles.row}>
              <Title text={"Verify Code"}/>
            </View>
            <TextInput
              value={code}
              onChangeText={(text: string) => { setCode(text) }}
              style={styles.onboardingInput}
              placeholder='code'
            />
            <Button
              onPress={() => {verify()}}
              title='Verify' />
          </View>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    display:  "flex",
    flexDirection: "column",
  },
  onboarding: {
    position: "absolute",
    bottom: '0%',
    display: "flex",
    alignItems: "center",
    width: width,
    height: 200,
    backgroundColor: "white",
    minHeight: 100,
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopEndRadius: 20,
  },
  onboardingInput:{ 
    position: "relative",
    height: 50,
    width: width - 20,
    backgroundColor: '#E9ECEF',
    marginVertical: 10,
    borderWidth: 0,
    borderRadius: 10,
    padding: 10,
  },
  row:{
    width: width -30,
  }
});