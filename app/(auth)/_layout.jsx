import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const AuthLayout = () => {
  return (
    <>
      <Stack>
        {/* Main sign in screen */}
        <Stack.Screen 
          name="sign-in"
          options={{
            headerShown: false
          }}
        />

        {/* Sign up options screen */}
        <Stack.Screen 
          name="sign-up"
          options={{
            headerShown: false
          }}
        />

        {/* Client sign up screen */}
        <Stack.Screen 
          name="sign-up client"
          options={{
            headerShown: false
          }}
        />

        {/* Professional sign up screen */}
        <Stack.Screen 
          name="sign-up Professional"
          options={{
            headerShown: false
          }}
        />
      </Stack>
      <StatusBar backgroundColor='#161622' style='light' />
    </>
  );
};

export default AuthLayout;