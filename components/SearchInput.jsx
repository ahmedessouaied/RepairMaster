import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';

const SearchInput = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (

        <View
            className={`space-x-4 border-2 w-full h-16 px-4 items-center text-black flex-row rounded-2xl ${isFocused ? 'border-secondary-100' : 'border-gray-300'
                } bg-black-100`}
                style={{backgroundColor: "#EFEFEF"}}
        >
            <TextInput
                className="text-base mt-0.5 text-white flex-1 font-pregular"
                value={value}
                placeholder="Search for a certain domain"
                placeholderTextColor="black"
                onChangeText={handleChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                secureTextEntry={title === 'Password' && !showPassword}
                {...props}
            />
            <TouchableOpacity>
                <Image
                    source={icons.search}
                    style={{
                        width: 40,
                        height: 40,
                        resizeMode: "contain",
                      }}
                />
            </TouchableOpacity>
        </View>
    );
};

export default SearchInput;
