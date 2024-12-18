import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { icons } from "../../constants";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10, // Adjust margin to fit icons and text
      }}
    >
      <Image
        source={icon}
        resizeMode="contain"
        style={{
          width: 30, // Use numeric values for width and height
          height: 30,
          tintColor: color, // Set the icon color
        }}
      />
      <Text
        style={{
          color: color,
          fontSize: 9, // Adjust font size for better alignment
          marginTop: 5, // Add space between icon and text
          fontWeight: focused ? "600" : "400", // Bold text when focused
        }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const [role, setRole] = useState(null); // Store user role
  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          // Check if the user exists in the "Clients" collection
          const clientDoc = doc(firestore, "Clients", user.uid);
          const clientSnap = await getDoc(clientDoc);
  
          if (clientSnap.exists()) {
            setRole("client");
            return;
          }
  
          // Check if the user exists in the "Professionals" collection
          const professionalDoc = doc(firestore, "Professionals", user.uid);
          const professionalSnap = await getDoc(professionalDoc);
  
          if (professionalSnap.exists()) {
            setRole("professional");
            return;
          }
  
          // If the user doesn't exist in either collection, set role to null
          setRole(null);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };
  
    fetchUserRole();
  }, []);
  

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FF0000",
          tabBarInactiveTintColor: "#CDCDE1",
          tabBarStyle: {
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 65, // Increase height to prevent clipping
            paddingBottom: 10, // Add padding for better spacing
            paddingTop: 10,
          },
        }}
      >
        {/* Render Home Tab only if the user is a professional */}
        {role === "professional" && (
          <Tabs.Screen
            name="home Professional"
            options={{
              title: "Home",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
              ),
            }}
          />
        )}
        {role === "client" && (
          <Tabs.Screen
            name="home client"
            options={{
              title: "Home",
              headerShown: true,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
              ),
            }}
          />
        )}
        
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.profile} color={color} name="Profile" focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.plus} color={color} name="Create" focused={focused} />
            ),
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default TabsLayout;
