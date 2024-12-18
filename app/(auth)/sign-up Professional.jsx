import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { React, useState } from 'react';
import { router, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField.jsx';
import { images } from '../../constants/index.js';
import CustomButton from '../../components/CustomButton.jsx';
import GovernorateDropdown from '../../components/GovernorateDropdown.jsx';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const SignUpProfessional = () => {
  const [form, setForm] = useState({
    username: '',
    Phone_Number: '',
    email: '',
    password: '',
    confirmPassword: '',
    governorate: '', // Governorate field
  });

  const [isSubmitting, setisSubmitting] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  // Password Validation Function
  const validatePassword = (password) => {
    const errors = [];
    
    // Check minimum length
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    // Check for number
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
    
    return errors;
  };

  // Firebase Sign-Up Handler
  const submit = async () => {
    const { username, email, Phone_Number, password, confirmPassword, governorate } = form;

    // Reset previous password errors
    setPasswordErrors([]);

    // Check if all fields are filled
    if (!username || !email || !Phone_Number || !password || !confirmPassword || !governorate) {
      Alert.alert('Error', 'Please fill in all the fields.');
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    // Validate password
    const passwordValidationErrors = validatePassword(password);
    
    if (passwordValidationErrors.length > 0) {
      setPasswordErrors(passwordValidationErrors);
      return;
    }

    setisSubmitting(true);

    try {
      const auth = getAuth(); 
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the display name with the username
      await updateProfile(user, { 
        displayName: username,
        photoURL: JSON.stringify({ governorate, phoneNumber: Phone_Number })
      });
      console.log('User created successfully:', user);

      router.replace('/home Professional'); // Navigate to Professional Home
    } catch (error) {
      Alert.alert('Error', error.message);
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
            title="Phone Number"
            value={form.Phone_Number}
            handleChangeText={(e) => setForm({ ...form, Phone_Number: e })}
            otherStyles="mt-7"
            keyboardType="phone-pad"
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          
          {/* Governorate Dropdown Component */}
          <View style={{ marginTop: 20 }}>
            <Text className="text-base font-pmedium text-gray-100 mb-2">
              Governorate
            </Text>
            <GovernorateDropdown
              onSelectGovernorate={(governorate) => 
                setForm({ ...form, governorate })
              }
              selectedGovernorate={form.governorate}
              placeholder="Choose Your Governorate"
              containerStyle={{ 
                borderWidth: 1, 
                borderColor: '#CCC', 
                borderRadius: 8 
              }}
            />
          </View>

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry={true}
          />
          <FormField
            title="Confirm Password"
            value={form.confirmPassword}
            handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
            otherStyles="mt-7"
            secureTextEntry={true}
          />
          {passwordErrors.length > 0 && (
            <View className="mt-2">
              {passwordErrors.map((error, index) => (
                <Text key={index} className="text-red-500 text-sm">
                  • {error}
                </Text>
              ))}
            </View>
          )}
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

export default SignUpProfessional;