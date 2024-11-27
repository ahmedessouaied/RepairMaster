import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { React, useState } from 'react';
import { router } from 'expo-router';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField';
import { images } from '../../constants';
import CustomButton from '../../components/CustomButton';
import { createUser } from '../../lib/appwrite';
const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })

  const [isSubmitting, setisSubmitting] = useState(false)
  const submit = async () => {
    if(!form.username || !form.email || !form.password){
      Alert.alert('Error', 'Please fill in all the field.')
    }
    setisSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username)

      // set it to global state..
      router.replace('/home')
    } catch (error) {
      Alert.alert('Error',error.message)

    } finally {
      setisSubmitting(false);
    }
    
  }

  return (
    <SafeAreaView className="bg-primary h-full"  style={{backgroundColor: "white"}}>
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
                style={{ color: "black", marginLeft: 10 }}
              >
                Repair Master
              </Text>
          </View>
          <Text className='font-psemibold text-white text-3xl mt-10 text-semibold' style={{color: "black"}}>
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
          />
          <CustomButton 
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2
          ">
            <Text className="text-lg text-gray-100 font-pregular" style={{color:"#7B7B8B"}}>
              Have an Account Already?
            </Text>
            <Link href="/sign-in" className="text-lg font-psemibold text-secondary" style={{color: "#FF0101"}}>Sign In</Link>
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

export default SignUp