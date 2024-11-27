import { TouchableOpacity, Text } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }) => {
    return (
            <TouchableOpacity className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
                disabled={isLoading}
                onPress={handlePress}
                activeOpacity={0.7}
                style={{backgroundColor: "#FF0101"}}
            >
                <Text className={`text-primary font-psemibold text-lg ${textStyles}`} style={{color: 'white'}}>{title}</Text>
            </TouchableOpacity>
    )
}

export default CustomButton;
