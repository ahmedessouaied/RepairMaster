import 'react-native-url-polyfill/auto';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import "../global.css";
import { images } from '../constants'
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';

export default function App() {
    const {isLoading, isLoggedIn} =  useGlobalContext();
    if (!isLoading && isLoggedIn) return <Redirect href="/home"/>

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View className="w-full justify-start items-center h-full px-4 gap-5">
                    <Image
                        source={images.logo}
                        className='w-[130px] h-[84px]'
                        resizeMode='contain'
                    />
                    <Image
                        source={images.cards}
                        className='max-w-[380px] w-full h-[300px]'
                        resizeMode='contain'
                    />
                    <View className='relative mt-5'>
                        <Text className='text-3xl text-black font-bold text-center'>
                        Repair Master: Skilled Help, Just a Tap Away!
                        </Text>
                    </View>
                    <Text className='text-base font-pregular text-gray-100 mt-7 text-center'>Your go-to app for reliable fixes, anytime, anywhere!
                    </Text>
                    <CustomButton
                        title="Continue with Email"
                        handlePress={() => { router.push('/sign-in') }}
                        containerStyles="w-full mt-7"
                    />
                </View>
            </ScrollView>
            <StatusBar backgroundColor='#161622' style='light' />
        </SafeAreaView>
    );
}


