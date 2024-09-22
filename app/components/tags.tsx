import React from 'react';
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import EmptyAssetsCard from './emptyAssets';
import Tag from './tag';
import { useAsset } from '@/context/assetContext';

export interface Tags {
    _id: string,
    name: string,
    description: string,
    color: string[],
} 

export default function Assets() {
    const { tags } = useAsset();

    return (
        <View style={styles.container}>
            <FlashList
                data={tags}
                estimatedItemSize={100}
                ListEmptyComponent={<EmptyAssetsCard />}
                renderItem={
                    ({ item }) =>
                    <TouchableOpacity
                        key={item._id}
                        style={styles.card}>
                       <View style={styles.row} >
                            <View style={styles.details}>
                                <Text
                                    style={styles.title}>
                                    {
                                        item.name
                                    }
                                </Text>
                                <Tag
                                    name={item.name}
                                    color={item.color}
                                />
                            </View>
                       </View>
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