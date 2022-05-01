import Firestore, { FieldValue } from "@google-cloud/firestore";
import Redis from "redis";
//import { REPL_MODE_STRICT } from "repl";

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
  const docRef = db.collection("userData").doc(email);
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

export async function buyCredits(amount, email){
  const docRef = db.collection("userData").doc(email).update({
    credits: FieldValue.increment(parseInt(amount))
  });
  return true;
}
export async function reduceCredit(email){
  const docRef = db.collection("userData").doc(email).update({
    credits: FieldValue.increment(-1)
  });
  return true;
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