import Firestore from "@google-cloud/firestore";
//import { createHmac } from "crypto";
import Redis from "redis";
//import { REPL_MODE_STRICT } from "repl";

// export let rclient = new Redis.createClient({
//   host: 'www.c1xu.me',
//   port: '443',
//   TLS: true,
// });

export let rclient = new Redis.createClient();

//Instantiating Firestore with project details
const db = new Firestore({
  projectId: "pftcxu",
  keyFilename: "./key.json",
});

rclient.on("connect", () => {
  console.log("Redis connected!");
  getTenPrice().then((data) => console.log(JSON.parse(data)));
  getTwentyPrice().then((data) => console.log(JSON.parse(data)));
  getThirtyPrice().then((data) => console.log(JSON.parse(data)));
})

export async function CreateUser(email) {
  const docRef = db.collection("userData").doc();
  return await docRef.set({
    credits: 10,
    email: email,
    admin: false,
  });
}

export async function GetUser(email) {
  const docRef = db.collection("userData");
  const snapshot = await docRef.where("email", "==", email).get();
  let data = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });

  // if (data.length > 0) {
  //   userCredits = data[0].credits;
  //   adminInfo = data[0].admin;
  // }
  return data;
}

// export async function CheckUser(email){
//   const docRef = db.collection("userData");
//   const snapshot = await docRef.where("email", "==", email).get();
//   let data = [];
//   snapshot.forEach((doc) => {
//     data.push(doc.data());
//   });

//   if (data.length > 0)
//     return true;
//   else 
//     return false;
// }

// export async function GetUserCredits() {
//   return userCredits;
// }

// export async function GetUserAdminInfo() {
//   return adminInfo;
// }

export async function setTenPrice(payload){
  if(!rclient.isOpen){
    await rclient.connect();
  }
  return await rclient.set("tenPrice", payload);
}

export async function setTwentyPrice(payload){
  if(!rclient.isOpen){
    await rclient.connect();
  }
  return await rclient.set("twentyPrice", payload);
}

export async function setThirtyPrice(payload){
  if(!rclient.isOpen){
    await rclient.connect();
  }
  return await rclient.set("thirtyPrice", payload);
}

export async function getTenPrice() {
  if(!rclient.isOpen){
    await rclient.connect();
  }
  return rclient.get("tenPrice");
}

export async function getTwentyPrice(){
  if(!rclient.isOpen){
    await rclient.connect();
  }
  return rclient.get("twentyPrice");
}

export async function getThirtyPrice(){
  if(!rclient.isOpen){
    await rclient.connect();
  }
  return rclient.get("thirtyPrice");
}



//Collection (Table)
//Document (Row)
//docRef selects the collection
// export async function AddDocument(collection, data) {
//   const docRef = db.collection(collection).doc();
//   return await docRef.set(data);
// }

// export async function GetDocument(collection, valueType, value) {
//   const docRef = db.collection(collection);
//   const snapshot = await docRef.where(valueType, "==", value).get();
//   let data = [];
//   snapshot.forEach((doc) => {
//     data.push(doc.data());
//   });
//   return data;
// }

// export function HashPassword(password) {
//   const secret = "ABCxyz";
//   return createHmac("sha256", password).update(secret).digest("hex");
// }