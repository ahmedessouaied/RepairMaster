import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { icons } from '../constants';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium"  style={{color:"#7B7B8B"}}>{title}</Text>
      <View
        className={`border-2 w-full h-16 px-4 items-center flex-row rounded-2xl ${
          isFocused ? 'border-secondary-100' : 'border-gray-200'
        } bg-black-100`}
        style={{backgroundColor: "#EFEFEF"}}
      >
        <TextInput
          className="flex-1 text-white font-psemibold"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#000000"
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={title === 'Password' && !showPassword}
          {...props}
          style={{color: "#000000"}}
        />
        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
            <Image
              source={showPassword ? icons.eye : icons.eyeHide}
              style={{
                width: 40,
                height: 40,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
