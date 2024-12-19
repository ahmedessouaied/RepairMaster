import { View, Text, ScrollView, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Link, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import { images } from '../../constants';
import CustomButton from '../../components/CustomButton';
import firebase from '../../config/firebaseConfig.js';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setisSubmitting] = useState(false);

  // Google Auth Setup
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '396887731178-2bjfdp3vi8f1ksb63oumpe01db7a7hi3.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  const redirectUri = makeRedirectUri({ scheme:'/home' });

  // Function to determine user role and route accordingly
  const routeBasedOnRole = async (userId) => {
    try {
      const db = getFirestore();
      
      // Check Clients collection
      const clientQuery = query(
        collection(db, 'Clients'),
        where('userId', '==', userId)
      );
      const clientDocs = await getDocs(clientQuery);
      
      if (!clientDocs.empty) {
        router.replace('/home client');
        return;
      }
      
      // Check Professionals collection
      const professionalQuery = query(
        collection(db, 'Professionals'),
        where('userId', '==', userId)
      );
      const professionalDocs = await getDocs(professionalQuery);
      
      if (!professionalDocs.empty) {
        router.replace('/home Professional');
        return;
      }
      
      // If no role found (shouldn't happen in normal flow)
      Alert.alert('Error', 'User role not found. Please contact support.');
    } catch (error) {
      console.error('Error determining user role:', error);
      Alert.alert('Error', 'Failed to determine user role. Please try again.');
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      if (response?.type === 'success') {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        const auth = getAuth();
        const userCredential = await signInWithCredential(auth, credential);
        await routeBasedOnRole(userCredential.user.uid);
      } else {
        await promptAsync({
          useProxy: true,
          redirectUri,
        });
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error('Google Sign-In Error:', error);
    }
  };

  // Handle Email/Password Sign-In
  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    setisSubmitting(true);
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      await routeBasedOnRole(userCredential.user.uid);
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        Alert.alert('Error', 'Invalid email or password. Please try again.');
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setisSubmitting(false);
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleSignIn();
    }
  }, [response]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[80vh] px-4 my-6">
          <Image source={images.logoCercle} resizeMode="contain" className="w-[100px] h-[85px]" />
          <Text className="text-3xl font-bold" style={{ color: 'black', marginLeft: 10 }}>
            Repair Master
          </Text>
          <Text className="font-psemibold text-black text-3xl mt-10 text-semibold">Sign In</Text>
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
            secureTextEntry={true}
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <CustomButton
            title="Sign In with Google"
            handlePress={handleGoogleSignIn}
            containerStyles="mt-4"
            disabled={!request}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">Don't Have an Account?</Text>
            <Link href="/sign-up" className="text-lg text-red font-psemibold text-secondary">
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;