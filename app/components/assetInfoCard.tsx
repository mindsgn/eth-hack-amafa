import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Button, Text, TouchableOpacity } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { generateRandomNumbers } from '@/hooks/genarteRandom';
import { calculatePercentage } from '@/hooks/calculate';
import DonutChart from './donut';
import { useFont } from '@shopify/react-native-skia';

interface AssetInfoCard {
  total: number,
  symbol: string
}

interface Data {
  value: number;
  percentage: number;
  color: string;
}

const RADIUS = 80;
const STROKE_WIDTH = 20;
const OUTER_STROKE_WIDTH = 20;
const GAP = 0.05;

export default function AssetInfoCard({total=0, symbol="R"} : AssetInfoCard) {
  
  const n = 2;
  const [data, setData] = useState<Data[]>([
    {
      value: 200,
      percentage: 20,
      color:"#fe769c"
    },
    {
      value: 200,
      percentage: 60,
      color:"#46a0f8"
    }
  ]);
  const totalValue = useSharedValue(total);
  const decimals = useSharedValue<number[]>([0.1, 0.1, 0.2, 0.4]);
  const colors = ['#fe769c', '#46a0f8', '#c3f439', '#88dabc', '#e43433'];
  
  const font = useFont(require('../assets/fonts/sf_pro-bold.otf'), 30);
  const smallFont = useFont(require('../assets/fonts/sf_pro-bold.otf'), 15);

  if (!font || !smallFont) {
    return <View />;
  }

  useEffect(() => {
  },[])

  return (
        <View style={styles.container}>  
          {
            /*
               <DonutChart
            radius={RADIUS}
            gap={GAP}
            strokeWidth={STROKE_WIDTH}
            outerStrokeWidth={OUTER_STROKE_WIDTH}
            font={font}
            smallFont={smallFont}
            totalValue={totalValue}
            n={n}
            decimals={decimals}
            colors={colors}
          />
            */
          }
         
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    height: 200,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row"
  },
  chartContainer: {
    width: RADIUS * 2,
    height: RADIUS * 2,
    marginTop: 10,
  },
  button: {
    marginVertical: 40,
    backgroundColor: '#f4f7fc',
    paddingHorizontal: 60,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
  },
});