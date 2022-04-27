import Firestore from "@google-cloud/firestore";
import { createHmac } from "crypto";
import Redis from "redis";
import { REPL_MODE_STRICT } from "repl";

export let rclient = new Redis.createClient();

//Instantiating Firestore with project details
const db = new Firestore({
  projectId: "pftcxu",
  keyFilename: "./key.json",
});

rclient.on("connect", () => {
  console.log("Redis connected!");
  getCreditsInfo().then((data) => console.log(JSON.parse(data)));
})

export async function CreateUser(email){
  const docRef = db.collection("userData").doc();
  return await docRef.set({
    credits: 10,
    email: email,
    admin: false,
  });
}

export async function GetUser(email){
  const docRef = db.collection("userData");
  const snapshot = await docRef.where("email", "==", email).get();
  let data = [];
  snapshot.forEach((doc) => {
    data.push(doc.data());
  });

  if(data.length > 0){
    userCredits = data[0].credits;
    adminInfo = data[0].admin;
  }
}

export async function GetUserCredits(){
  return userCredits;
}

export async function GetUserAdminInfo(){
  return adminInfo;
}

const getCreditsInfo = async () => {
  return rclient.get("credits");
}

const setCredits = async (payload) => {
  return await rclient.set("credits", JSON.stringify(payload));
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