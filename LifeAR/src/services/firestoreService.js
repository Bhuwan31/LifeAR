import {
 collection,
 addDoc,
 getDocs,
 getDoc,
 doc,
 updateDoc,
 deleteDoc,
 query,
 where,
 orderBy,
 limit,
 serverTimestamp
} from "firebase/firestore";

import { db } from "../../firebaseConfig";


const COLLECTIONS = {
 USERS:"users",
 EMERGENCIES:"emergencies",
 TRAINING:"training_progress",
 PANIC:"panic_alerts"
};



/* ------------------------
 CREATE EMERGENCY REPORT
-------------------------*/
export const createEmergencyReport = async ({
 userId,
 emergencyType,
 severity,
 location,
 notes=""
}) => {

 try{

   const docRef = await addDoc(
     collection(
       db,
       COLLECTIONS.EMERGENCIES
     ),
     {
       userId,
       emergencyType,
       severity,
       location,
       notes,
       status:"active",
       createdAt:serverTimestamp(),
       updatedAt:serverTimestamp()
     }
   );

   return {
     success:true,
     id:docRef.id
   };

 }catch(error){
   throw error;
 }

};



/* ------------------------
 GET ONE EMERGENCY
-------------------------*/
export const getEmergencyById = async(id)=>{

 try{

 const snap=await getDoc(
   doc(
     db,
     COLLECTIONS.EMERGENCIES,
     id
   )
 );

 if(!snap.exists()){
   throw new Error(
     "Emergency not found"
   );
 }

 return {
   id:snap.id,
   ...snap.data()
 };

 }catch(error){
  throw error;
 }

};



/* ------------------------
 GET USER EMERGENCIES
-------------------------*/
export const getUserEmergencies = async(
 userId
)=>{

 try{

 const q=query(
   collection(
    db,
    COLLECTIONS.EMERGENCIES
   ),
   where("userId","==",userId),
   orderBy("createdAt","desc"),
   limit(50)
 );

 const snapshot=await getDocs(q);

 return snapshot.docs.map(
  item=>({
    id:item.id,
    ...item.data()
  })
 );

 }catch(error){
  throw error;
 }

};



/* ------------------------
 UPDATE EMERGENCY STATUS
-------------------------*/
export const updateEmergencyStatus = async(
 emergencyId,
 newStatus
)=>{

 try{

 await updateDoc(
  doc(
   db,
   COLLECTIONS.EMERGENCIES,
   emergencyId
  ),
  {
   status:newStatus,
   updatedAt:serverTimestamp()
  }
 );

 return true;

 }catch(error){
  throw error;
 }

};



/* ------------------------
 DELETE REPORT
-------------------------*/
export const deleteEmergencyReport=async(
 emergencyId
)=>{

 try{

 await deleteDoc(
   doc(
    db,
    COLLECTIONS.EMERGENCIES,
    emergencyId
   )
 );

 return true;

 }catch(error){
  throw error;
 }

};



/* ------------------------
 SAVE TRAINING PROGRESS
-------------------------*/
export const saveTrainingProgress=async({
 userId,
 moduleName,
 completed
})=>{

 try{

 await addDoc(
   collection(
     db,
     COLLECTIONS.TRAINING
   ),
   {
     userId,
     moduleName,
     completed,
     createdAt:serverTimestamp()
   }
 );

 return true;

 }catch(error){
  throw error;
 }

};