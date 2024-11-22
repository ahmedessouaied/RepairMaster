import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';

const SearchInput = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (

        <View
            className={`space-x-4 border-2 w-full h-16 px-4 items-center flex-row rounded-2xl ${isFocused ? 'border-secondary-100' : 'border-black-200'
                } bg-black-100`}
        >
            <TextInput
                className="text-base mt-0.5 text-white flex-1 font-pregular"
                value={value}
                placeholder="Search for a video topic"
                placeholderTextColor="#7b7b8b"
                onChangeText={handleChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                secureTextEntry={title === 'Password' && !showPassword}
                {...props}
            />
            <TouchableOpacity>
                <Image
                    source={icons.search}
                    className="w-5 h-5"
                    resizeMode='contain'
                />
            </TouchableOpacity>
        </View>
    );
};

export default SearchInput;
