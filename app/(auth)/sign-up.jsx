import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { React, useState } from 'react';
import { router, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import { images } from '../../constants';
import CustomButton from '../../components/CustomButton';
import CustomDropdown from '../../components/CustomDropdown';
import firebase from '../../config/firebaseConfig.js'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // Firebase imports

const SignUp = () => {

  const [isSubmitting, setisSubmitting] = useState(false);
  const signUser = async () => {
      setisSubmitting(true);
      try {
        router.replace('/sign-up client'); // Navigate to sign up client
      } catch (error) {
        Alert.alert('Error', error.message); // Display error message
        console.error('Sign-Up Error:', error);
      } finally{
        setisSubmitting(false);
      } 
    };
    const signProfessional = async () => {
      setisSubmitting(true);
      try {
        router.replace('/sign-up Professional'); // Navigate to sign up Professional
      } catch (error) {
        Alert.alert('Error', error.message); // Display error message
        console.error('Sign-Up Error:', error);
      } finally{
        setisSubmitting(false);
      } 
    };

    return (
      <SafeAreaView className="bg-primary h-full">
        
          <View className="w-full justify-center min-h-[80vh] px-4 my-6">
            <View className="flex-row items-center">
              <Image
                source={images.logoCercle}
                resizeMode="contain"
                className="w-[100px] h-[85px]"
              />
              <Text
                className="text-3xl font-bold"
                style={{ color: 'black', marginLeft: 10 }}
              >
                Repair Master
              </Text>
            </View>
            <Text className="font-psemibold text-black text-3xl mt-10 text-semibold">
              Sign Up As :
            </Text>
            <CustomButton
              title="Client"
              handlePress={signUser}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />
            <CustomButton
              title="Professional"
              handlePress={signProfessional}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="text-lg text-gray-100 font-pregular">
                Have an Account Already?
              </Text>
              <Link
                href="/sign-in"
                className="text-lg text-red font-psemibold text-secondary"
              >
                Sign In
              </Link>
            </View>
          </View>
      </SafeAreaView>
    );
};

export default SignUp;