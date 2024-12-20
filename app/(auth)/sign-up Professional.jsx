import { View, Text, ScrollView, Image, Alert } from "react-native";
import { React, useState } from "react";
import { router, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField.jsx";
import { images } from "../../constants/index.js";
import CustomButton from "../../components/CustomButton.jsx";
import GovernorateDropdown from "../../components/GovernorateDropdown.jsx";
import FieldOfWorkDropdown from "../../components/FieldOfWorkDropdown.jsx"; // Import the new dropdown
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const SignUpProfessional = () => {
  const [form, setForm] = useState({
    username: "",
    Phone_Number: "",
    email: "",
    password: "",
    confirmPassword: "",
    governorate: "",
    fieldOfWork: "",
    description: "",
    Profile_pic: "",
  });

  const [isSubmitting, setisSubmitting] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8)
      errors.push("Password must be at least 8 characters long");
    if (!/[A-Z]/.test(password))
      errors.push("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(password))
      errors.push("Password must contain at least one lowercase letter");
    if (!/[0-9]/.test(password))
      errors.push("Password must contain at least one number");
    if (!/[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]/.test(password))
      errors.push("Password must contain at least one special character");
    return errors;
  };

  const submit = async () => {
    const {
      username,
      email,
      Phone_Number,
      password,
      confirmPassword,
      governorate,
      fieldOfWork,
      description,
    } = form;

    setPasswordErrors([]);

    if (
      !username ||
      !email ||
      !Phone_Number ||
      !password ||
      !confirmPassword ||
      !governorate ||
      !fieldOfWork ||
      !description
    ) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (description.length < 50) {
      Alert.alert(
        "Error",
        "Description should be at least 50 characters long."
      );
      return;
    }

    const passwordValidationErrors = validatePassword(password);
    if (passwordValidationErrors.length > 0) {
      setPasswordErrors(passwordValidationErrors);
      return;
    }

    setisSubmitting(true);

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: JSON.stringify({ role: "professional", username }),
      });

      const db = getFirestore();

      await addDoc(collection(db, "Professionals"), {
        username,
        email,
        phoneNumber: Phone_Number,
        governorate,
        fieldOfWork,
        description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.uid,
        role: "professional",
        profileComplete: false,
        status: "pending",
        rating: 0,
        totalRatings: 0,
        completedJobs: 0,
        specialties: [fieldOfWork],
        availabilityStatus: "available",
        verificationStatus: "unverified",
        Profile_pic: "",
      });

      console.log("User created successfully:", user);
      console.log("Professional document created in Firestore");

      router.replace("/home Professional");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Email Already Registered",
          "This email address is already associated with an account. Please use a different email or sign in."
        );
      } else {
        Alert.alert("Error", error.message);
      }
      console.error("Sign-Up Error:", error);
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
              style={{ color: "black", marginLeft: 10 }}
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
                borderColor: "#CCC",
                borderRadius: 8,
              }}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text className="text-base font-pmedium text-gray-100 mb-2">
              Field of Work
            </Text>
            <FieldOfWorkDropdown
              onSelectField={(fieldOfWork) => setForm({ ...form, fieldOfWork })}
              selectedField={form.fieldOfWork}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Text className="text-base font-pmedium text-gray-100 mb-2">
              Professional Description
            </Text>
            <FormField
              value={form.description}
              handleChangeText={(e) => setForm({ ...form, description: e })}
              multiline={true}
              numberOfLines={4}
              placeholder="Describe your experience"
              textAlignVertical="top"
              style={{
                height: 150,
                paddingTop: 10,
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
