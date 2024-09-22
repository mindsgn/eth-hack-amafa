import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from './authContext';

export interface Tags {
    _id: string,
    name: string,
    description: string,
    color: string,
}


export interface Category {
    _id: string,
    name: string,
    description: string,
    color: string,
}


export interface Asset {
    _id: string,
    title: string,
    description: string,
    images: string[],
    value: number,
    currency: string,
    owner: string,
    custodain: string | null
    category: {
        name: string,
        color: string,
        description: string,
    }
}

interface AssetContext {
    assets: Asset[],
    tags: Tags[],
    category: Category[],
    getAssets: () => void,
    removeAsset: (id: string) => void,
}
 

interface AssetProviderProps {
    children: ReactNode;
}


const AssetContext = createContext<AssetContext | undefined>(undefined);


const useAsset = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


const AssetProvider = ({ children }: AssetProviderProps) => {
    const { isAuth } = useAuth()
    const [ assets, setAssets] = useState<Asset[]>([])
    const [ tags, setTags] = useState<Tags[]>([])
    const [ category, setCategory] = useState<Category[]>([])
    const [ page, setPage ] = useState<number>(1)
    const [ limit, setLimit ] = useState<number>(100)

    const getAssets = async() => {
        try{
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/assets?limit=${limit}&page=${page}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${isAuth?.token}`
                },
            });
            const data = await response.json();
            const { assets } = data;
            setAssets(assets);
        } catch(error) {
            console.log(error)
        }
    };

    const getTags = async() => {
        try{
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/tags?limit=${limit}&page=${page}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${isAuth?.token}`
                },
            });
            const data = await response.json();
            const { tags } = data;
            setTags(tags);
        } catch(error){
            console.log(error)
        }
    }; 

    const getCAtegory = async() => {
        try{
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/category?limit=${limit}&page=${page}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${isAuth?.token}`
                },
            });
            const data = await response.json();
            const { category } = data;
            setCategory(category);
        } catch(error){
            console.log(error)
        }
    }; 

    const removeAsset = async(id: string) => {
        try{
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/asset/delete/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${isAuth?.token}`
                },
            });
            response.json();
            await getAssets();
        } catch(error) {
            console.log(error)
        }
    };
    
    useEffect(()=> {
        if(isAuth){
            const {token } = isAuth
            if(token){
                getAssets()
            }    
        }
    },[isAuth])

    return (
      <AssetContext.Provider 
        value={{
            assets,
            tags,
            category,
            getAssets,
            removeAsset,
        }}>
        {children}
      </AssetContext.Provider>
    );
  };
  
  export {
      useAsset,
      AssetProvider
  }