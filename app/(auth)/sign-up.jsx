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
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [isSubmitting, setisSubmitting] = useState(false);

  // Firebase Sign-Up Handler
  const submit = async () => {
    const { username, email, password } = form;

    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    setisSubmitting(true);

    try {
      const auth = getAuth(); 
      const userCredential = await createUserWithEmailAndPassword(auth, email, password); // Create user
      const user = userCredential.user;

      // Update the display name with the username
      await updateProfile(user, { displayName: username });
      console.log('User created successfully:', user);

      router.replace('/home'); // Navigate to home page
    } catch (error) {
      Alert.alert('Error', error.message); // Display error message
      console.error('Sign-Up Error:', error);
    } finally {
      setisSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
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
            Sign Up
          </Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-10"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry={true} // Hide password
          />
          <CustomDropdown />
          <CustomButton
            title="Sign Up"
            handlePress={submit}
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;