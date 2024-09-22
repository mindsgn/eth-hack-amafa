import React, { createContext, useContext, ReactNode, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export interface Auth {
   token: string | null,
   email: string | null,
}

interface AuthContext {
  isAuth: Auth  | null;
  getAuth: () => Promise<boolean>;
  logout: () => void;
}
 

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuth, setAuth] = useState<Auth | null>(null);

    const getAuth = async() => {
      try{
        const response = await AsyncStorage.getItem('auth');
        if(response){
          const {token, email}= JSON.parse(response);
          if(token && email){
            const authResponse = await fetch(`${process.env.EXPO_PUBLIC_API_URL}`, {
              method: "GET",
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
            })
   
            if(authResponse.ok){
              setAuth({
                token, 
                email
              })
              return true
            }
          }
        }
        
        return false
      } catch(error: any) {
        return false
      }
    }

    const logout = async() => {
      try{
        await AsyncStorage.removeItem('auth');
        router.push("/")
      }catch(error){
      }
    }

    return (
      <AuthContext.Provider 
        value={{
            isAuth,
            getAuth,
            logout
        }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export {
      useAuth,
      AuthProvider
  }