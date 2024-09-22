import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { Link } from 'expo-router';
import AssetInfoCard from './assetInfoCard';
import EmptyAssetsCard from './emptyAssets';
import Tag from './tag';
import { useAsset } from '@/context/assetContext';

export interface Location {
    address: string,
    date: Date,
    point: {
        latitude: number,
        longitude: number
    }
} 

export interface Asset {
    _id: string,
    name: string,
    description: string,
    images: string[],
    value: number,
    currency: string,
    owner: string;
    location?: Location[],
    category: {
        name: string,
        description: string,
        color: string
    }
} 

export default function Assets() {
    const { assets } = useAsset();
    const [ total, setTotal ] = useState<number>(0);
    
    const organiseData = () => {
        let sum = 0;

        assets.map((item) => {
            sum = sum + item.value;
        });

        setTotal(sum);

        // const generateNumbers = generateRandomNumbers(n);
        // const total = generateNumbers.reduce(
        //  (acc, currentValue) => acc + currentValue,
        //  0,
        // );
        // const generatePercentages = calculatePercentage(generateNumbers, total);
        // const generateDecimals = generatePercentages.map(
        //   number => Number(number.toFixed(0)) / 100,
        // );
        // 
        // decimals.value = [...generateDecimals];

        // const arrayOfObjects = generateNumbers.map((value, index) => ({
        //   value,
        //  percentage: generatePercentages[index],
        //  color: colors[index],
        // }));

        //setData(arrayOfObjects);
    };

    useEffect(() => {
        // organiseData()
    },[assets])

    return (
        <View style={styles.container}>
            <FlashList
                data={assets}
                estimatedItemSize={100}
                ListHeaderComponent={
                    /*assets.length === 0 ? null : <AssetInfoCard total={total} symbol={"R"}/>*/
                    <></>
                }
                ListEmptyComponent={<EmptyAssetsCard />}
                renderItem={
                    ({ item }) =>
                    <TouchableOpacity
                        key={item._id}
                        style={styles.card}>
                       <View style={styles.row} >
                            <ImageBackground
                                source={ {uri: `${process.env.EXPO_PUBLIC_API_URL}/uploads/${item.images[0]}`} }
                                style={styles.image}
                            />
                            <View style={styles.details}>
                                <Text
                                    style={styles.title}>
                                    {
                                        //@ts-expect-error
                                        item.name
                                    }
                                </Text>
                                <Tag
                                    name={item.category.name}
                                    color={item.category.color}
                                />
                            </View>
                       </View>
                        <Link
                            style={styles.more} 
                            href={
                                {
                                    //@ts-expect-error
                                    pathname: `/asset/${item._id}`,
                                    params: {
                                        assetID: item._id,
                                        image:  item.images[0],
                                        //@ts-expect-error
                                        name: item.name,
                                        description: item.description,
                                        owner: item.owner,
                                        category: item.category.name,
                                        color: item.category.color,
                                        currency: item.currency,
                                        value: item.value,
                                    },
                                }
                            }
                        >
                            <Text style={styles.text} >{">"}</Text>
                        </Link>
                    </TouchableOpacity>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingBottom: 100,
  },
  list: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "100%",
    backgroundColor: 'white', 
    padding: 10,
  },
  image: {
    width: 50,
    height: 50,
    padding: 2,
    borderRadius: 10,
  }, 
  title:{
    fontSize: 21,
    fontWeight: "bold"
  },
  details: {
    display: 'flex',
    height: '100%',
    marginHorizontal: 10,
    flexDirection: 'column',
    justifyContent: "space-between"
 },
 more:{
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 30,
 },
 text:{
    fontSize: 20,
 }, 
 row:{
    display: "flex",
    flexDirection: "row",
    height: 50
 }
});