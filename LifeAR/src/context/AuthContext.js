import React,{
 createContext,
 useContext,
 useReducer,
 useEffect,
 useMemo,
 useCallback
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
 signInWithEmailAndPassword,
 createUserWithEmailAndPassword,
 sendPasswordResetEmail,
 signOut,
 onAuthStateChanged,
 updateProfile
} from "firebase/auth";

import { auth } from "../../firebaseConfig";


const AuthContext = createContext(undefined);

const CURRENT_USER_KEY='@lifear_current_user';


const initialState = {
 isLoading:true,
 isAuthenticated:false,
 user:null,
 error:null
};


function authReducer(state,action){

 switch(action.type){

  case "AUTH_LOADING":
   return {
    ...state,
    isLoading:true,
    error:null
   };

  case "AUTH_SUCCESS":
   return {
    ...state,
    isLoading:false,
    isAuthenticated:true,
    user:action.payload,
    error:null
   };

  case "AUTH_FAILURE":
   return {
    ...state,
    isLoading:false,
    isAuthenticated:false,
    user:null,
    error:action.payload
   };

  case "AUTH_LOGOUT":
   return {
    ...state,
    isLoading:false,
    isAuthenticated:false,
    user:null,
    error:null
   };

  case "UPDATE_USER":
   return{
    ...state,
    user:{
      ...state.user,
      ...action.payload
    }
   };

  case "CLEAR_ERROR":
   return{
    ...state,
    error:null
   };

  default:
   return state;
 }
}



export function AuthProvider({children}){

 const [state,dispatch]=useReducer(
  authReducer,
  initialState
 );


/* session listener */
useEffect(()=>{

 const unsubscribe=
  onAuthStateChanged(
    auth,
    async(firebaseUser)=>{

      if(firebaseUser){

        const user={
          uid:firebaseUser.uid,
          email:firebaseUser.email,
          displayName:
            firebaseUser.displayName || ""
        };

        await AsyncStorage.setItem(
         CURRENT_USER_KEY,
         JSON.stringify(user)
        );

        dispatch({
          type:"AUTH_SUCCESS",
          payload:user
        });

      }else{

        dispatch({
          type:"AUTH_LOGOUT"
        });

      }

    }
  );

 return unsubscribe;

},[]);



/* LOGIN */
const login=useCallback(
async(email,password)=>{

 dispatch({
   type:"AUTH_LOADING"
 });

 try{

 const userCredential=
   await signInWithEmailAndPassword(
     auth,
     email,
     password
   );

 const user={
   uid:userCredential.user.uid,
   email:userCredential.user.email
 };

 await AsyncStorage.setItem(
   CURRENT_USER_KEY,
   JSON.stringify(user)
 );

 dispatch({
   type:"AUTH_SUCCESS",
   payload:user
 });

 return user;

 }catch(error){

 dispatch({
   type:"AUTH_FAILURE",
   payload:error.message
 });

 throw error;

}

},[]);



/* REGISTER */
const register=useCallback(
async(userData)=>{

 dispatch({
  type:"AUTH_LOADING"
 });

 try{

 const userCredential=
  await createUserWithEmailAndPassword(
    auth,
    userData.email,
    userData.password
  );

 if(userData.name){

 await updateProfile(
   userCredential.user,
   {
    displayName:userData.name
   }
 );

 }

 const user={
  uid:userCredential.user.uid,
  email:userCredential.user.email,
  displayName:userData.name || ""
 };

 await AsyncStorage.setItem(
   CURRENT_USER_KEY,
   JSON.stringify(user)
 );

 dispatch({
  type:"AUTH_SUCCESS",
  payload:user
 });

 return user;

 }catch(error){

 dispatch({
   type:"AUTH_FAILURE",
   payload:error.message
 });

 throw error;

 }

},[]);



/* FORGOT PASSWORD */
const forgotPassword=useCallback(
async(email)=>{

 await sendPasswordResetEmail(
   auth,
   email
 );

 return{
   success:true
 };

},[]);



/* RESET PASSWORD
handled by email reset flow */
const resetPassword=useCallback(
async()=>{
 return {
   success:true
 };
},[]);



/* LOGOUT */
const logout=useCallback(
async()=>{

 await signOut(auth);

 await AsyncStorage.removeItem(
   CURRENT_USER_KEY
 );

 dispatch({
   type:"AUTH_LOGOUT"
 });

},[]);



/* UPDATE PROFILE */
const updateUserProfile=useCallback(
async(updates)=>{

 try{

 await updateProfile(
   auth.currentUser,
   updates
 );

 dispatch({
  type:"UPDATE_USER",
  payload:updates
 });

 }catch(error){
  throw error;
 }

},[]);



const clearError=useCallback(()=>{
 dispatch({
   type:"CLEAR_ERROR"
 });
},[]);



const value=useMemo(
()=>({
 ...state,
 login,
 register,
 logout,
 forgotPassword,
 resetPassword,
 updateProfile:updateUserProfile,
 clearError
}),
[
state,
login,
register,
logout,
forgotPassword,
resetPassword,
updateUserProfile,
clearError
]
);


return(
<AuthContext.Provider value={value}>
 {children}
</AuthContext.Provider>
);

}



export function useAuth(){

const context=useContext(
 AuthContext
);

if(!context){
 throw new Error(
  "useAuth must be used within AuthProvider"
 );
}

return context;

}