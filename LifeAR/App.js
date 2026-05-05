import React,{useEffect} from "react";

import {
 View,
 ActivityIndicator,
 Alert
} from "react-native";

import * as Location from "expo-location";

import { StatusBar } from "expo-status-bar";

import {
 NavigationContainer
} from "@react-navigation/native";

import {
 createStackNavigator
} from "@react-navigation/stack";

import {
 SafeAreaProvider
} from "react-native-safe-area-context";

import {
 AuthProvider,
 useAuth
} from "./src/context/AuthContext";


// Auth Screens
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";


// App Screens
import HomeScreen from "./src/screens/HomeScreen";
import EmergencyTypeScreen from "./src/screens/EmergencyTypeScreen";
import PanicModeScreen from "./src/screens/PanicModeScreen";
import ARGuideScreen from "./src/screens/ARGuideScreen";
import EmergencyPhrasesScreen from "./src/screens/EmergencyPhrasesScreen";
import TrainingModeScreen from "./src/screens/TrainingModeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";


const Stack=createStackNavigator();



function AuthStackNavigator(){

 return(
 <Stack.Navigator
   screenOptions={{
    headerStyle:{
      backgroundColor:"#1a1a1a",
      elevation:0,
      shadowOpacity:0
    },
    headerTintColor:"#fff",
    headerTitleStyle:{
      fontWeight:"bold"
    },
    cardStyle:{
      backgroundColor:"#0a0a0a"
    }
   }}
 >

 <Stack.Screen
   name="Login"
   component={LoginScreen}
   options={{
    headerShown:false
   }}
 />

 <Stack.Screen
   name="Register"
   component={RegisterScreen}
   options={{
    title:"Create Account"
   }}
 />

 <Stack.Screen
   name="ForgotPassword"
   component={ForgotPasswordScreen}
   options={{
    title:"Reset Password"
   }}
 />

 </Stack.Navigator>
 );

}



function AppStackNavigator(){

return(
<Stack.Navigator
 screenOptions={{
   headerStyle:{
    backgroundColor:"#1a1a1a",
    elevation:0,
    shadowOpacity:0
   },
   headerTintColor:"#fff",
   headerTitleStyle:{
    fontWeight:"bold"
   },
   cardStyle:{
    backgroundColor:"#0a0a0a"
   }
 }}
>

<Stack.Screen
 name="Home"
 component={HomeScreen}
 options={{
  headerShown:false
 }}
/>

<Stack.Screen
 name="EmergencyType"
 component={EmergencyTypeScreen}
 options={{
  title:"Select Emergency Type"
 }}
/>

<Stack.Screen
 name="PanicMode"
 component={PanicModeScreen}
 options={{
  headerShown:false
 }}
/>

<Stack.Screen
 name="ARGuide"
 component={ARGuideScreen}
 options={{
  headerShown:false
 }}
/>

<Stack.Screen
 name="EmergencyPhrases"
 component={EmergencyPhrasesScreen}
 options={{
  title:"Emergency Phrases"
 }}
/>

<Stack.Screen
 name="TrainingMode"
 component={TrainingModeScreen}
 options={{
  title:"Training Mode"
 }}
/>

<Stack.Screen
 name="Profile"
 component={ProfileScreen}
 options={{
  title:"My Profile"
 }}
/>

<Stack.Screen
 name="EditProfile"
 component={EditProfileScreen}
 options={{
  title:"Edit Profile"
 }}
/>

</Stack.Navigator>
);

}




function RootNavigator(){

const {
 isLoading,
 isAuthenticated
}=useAuth();



useEffect(()=>{

 requestLocationPermission();

},[]);



const requestLocationPermission=async()=>{

 try{

 const {status}=
  await Location.requestForegroundPermissionsAsync();

 if(status!=="granted"){

   Alert.alert(
    "Location Permission",
    "Location helps provide emergency assistance features."
   );

   return;
 }

 const location=
  await Location.getCurrentPositionAsync({
   accuracy:
   Location.Accuracy.Balanced
  });

 console.log(
   "User location:",
   location.coords
 );

 }catch(error){
  console.log(
   "Location error:",
   error
  );
 }

};



if(isLoading){
 return(
  <View
   style={{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
   }}
  >
   <ActivityIndicator size="large"/>
  </View>
 );
}



return(
<NavigationContainer>
 <StatusBar style="light"/>

 {
  isAuthenticated
   ? <AppStackNavigator/>
   : <AuthStackNavigator/>
 }

</NavigationContainer>
);

}



export default function App(){

return(
<SafeAreaProvider>
 <AuthProvider>
   <RootNavigator/>
 </AuthProvider>
</SafeAreaProvider>
);

}