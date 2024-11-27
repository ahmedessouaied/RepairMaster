import { View, Text, ScrollView, Image } from 'react-native';
import { React, useState } from 'react';
import { Link } from 'expo-router';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField';
import { images } from '../../constants';
import CustomButton from '../../components/CustomButton';
import { signIn } from '../../lib/appwrite';
const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [isSubmitting, setisSubmitting] = useState(false)
  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the field.')
    }
    setisSubmitting(true);
    try {
      await signIn(form.email, form.password)

      // set it to global state..
      router.replace('/home')
    } catch (error) {
      Alert.alert('Error', error.message)

    } finally {
      setisSubmitting(false);
    }

  }

  return (
    <SafeAreaView className="bg-primary h-full" style={{backgroundColor: "white"}}>
      <ScrollView>
        <View className="w-full justify-center min-h-[80vh] px-4 my-6"><View className="flex-row items-center">
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
          <Text className='font-psemibold text-white text-3xl mt-10 text-semibold' style={{color: "black"}} >
            Sign in
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
          />
          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2
          ">
            <Text className="text-lg text-gray-100 font-pregular"  style={{color:"#7B7B8B"}}>
              Don't Have an Account?
            </Text>
            <Link href="/sign-up" className="text-lg font-psemibold text-secondary" style={{color: "#FF0101"}}>Sign Up</Link>
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

export default SignIn