import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { icons } from "../../constants";

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
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FF0000",
          tabBarInactiveTintColor: "#CDCDE0",
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
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
            ),
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
      </Tabs>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default TabsLayout;
