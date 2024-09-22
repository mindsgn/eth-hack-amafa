import React from 'react';
import { StyleSheet, TextInput, Text, TouchableOpacity, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';

interface Category {
    name: string,
    color: string,
    description: string
}

interface DropDown {
    list: Category[],
    placeholder: string,
    width?: string | number,
    onSelect: (select: string) => void
}

export default function DropDown({
    list,
    placeholder,
    width="100%",
    onSelect
}: DropDown) {
    return (
        <SelectDropdown
          data={list}
          onSelect={(selectedItem, index) => {
            onSelect(selectedItem);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
                //@ts-expect-error
                <View style={[styles.dropdownButtonStyle, { width }]}>
                    {selectedItem && (
                        <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
                    )}
                    <Text style={styles.dropdownButtonTxtStyle}>
                    {(selectedItem && selectedItem.name) || placeholder}
                    </Text>
                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View style={{...styles.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                <Text style={styles.dropdownItemTxtStyle}>{item.name}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
    );
}

const styles = StyleSheet.create({
    dropdownButtonStyle: {
        width: "100%",
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginBottom: 10,
      },
      dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
      },
      dropdownButtonArrowStyle: {
        fontSize: 28,
      },
      dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
      },
      dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
      },
      dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
      },
      dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
      },
      dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
      },
});