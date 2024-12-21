import { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { icons } from "../../constants";
import {db, auth } from "../../config/firebaseConfig.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

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
      <Text numberOfLines={1}
        style={{
          color: color,
          fontSize: 9, // Adjust font size for better alignment
          marginTop: 5, // Add space between icon and text
          fontWeight: focused ? "600" : "400", // Bold text when focused
          flexShrink: 0,
          flexWrap: 'nowrap',
          flexGrow: 1
        }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const [role, setRole] = useState(null); // Store user role

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        
          const userId = auth.currentUser?.uid;
    
          // console.log("Fetching data for user:", auth.currentUser);

    
          // Check Clients collection
          const clientQuery = query(
            collection(db, "Clients"),
            where("userId", "==", userId)
          );

          const clientSnap = await getDocs(clientQuery);
          console.log(clientSnap)
  
          if (!clientSnap.empty) {
            setRole("client");
            return;
          }
  
          // Check if the user exists in the "Professionals" collection
          const professionalDoc = doc(firestore, "Professionals", user.uid);
          const professionalSnap = await getDocs(professionalDoc);
  
          if (!professionalSnap.empty) {
            setRole("professional");
            return;
          }
  
          // If the user doesn't exist in either collection, set role to null
          setRole(null);
        
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
        
          <Tabs.Screen
            name="homeprofessional"
            options={{
              title: "Home",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
              ),
              tabBarItemStyle: role === "professional" ? {} : { display: 'none' }
            }}
            style={{opacity: 0}}
          />
     
       
          <Tabs.Screen
            name="homeclient"
            options={{
              title: "Home",
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
              ),
              tabBarItemStyle: role === "client" ? {} : { display: 'none' }
            }}
          />
        
        
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
        <Tabs.Screen
          name="repaircalendar"
          options={{
            title: "Calendar",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.bookmark} color={color} name="Calendar" focused={focused} />
            ),
              tabBarItemStyle: role === "professional" ? {} : { display: 'none' }
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default TabsLayout;
