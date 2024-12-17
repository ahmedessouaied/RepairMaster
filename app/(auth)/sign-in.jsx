import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

GoogleSignin.configure({
  webClientId:
    "396887731178-2bjfdp3vi8f1ksb63oumpe01db7a7hi3.apps.googleusercontent.com",
});

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setisSubmitting] = useState(false);

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const signInResult = await GoogleSignin.signIn();

    // Try the new style of google-sign in result, from v13+ of that module
    idToken = signInResult.data?.idToken;
    if (!idToken) {
      // if you are using older versions of google-signin, try old style result
      idToken = signInResult.idToken;
    }
    if (!idToken) {
      throw new Error("No ID token found");
    }

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(
      signInResult.data.token
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  // Handle Google Sign-In
  const handleGoogleSignIn = () => {
    onGoogleButtonPress().then(() => {
      console.log("Signed in with Google!");
      router.replace("/home");
    });
  };

  // Handle Email/Password Sign-In
  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    setisSubmitting(true);
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, form.email, form.password);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setisSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[80vh] px-4 my-6">
          <Image
            source={images.logoCercle}
            resizeMode="contain"
            className="w-[100px] h-[85px]"
          />
          <Text
            className="text-3xl font-bold"
            style={{ color: "black", marginLeft: 10 }}
          >
            Repair Master
          </Text>
          <Text className="font-psemibold text-black text-3xl mt-10 text-semibold">
            Sign In
          </Text>
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
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't Have an Account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg text-red font-psemibold text-secondary"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
