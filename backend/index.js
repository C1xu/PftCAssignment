import Express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import https from "https";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import auth from "./routes/auth.js";
import upload from "./routes/upload.js";

const PORT = 443; //Https port 
const PORTnoS = 80; //80 Http port

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const apiKey = "projects/782692281082/secrets/getOutAPI_key/versions/1";

//Session Config
// const config = {
//   genid: (req) => uuid(),
//   secret: "keyboard cat",
//   cookie: {},
//   resave: false,
//   saveUninitialized: true,
// }

const app = Express();
//app.use(session(config));
app.enable("trust proxy");
app.use(Express.static(path.join(__dirname, "../frontend/public/")));
app.use(cors());

const startServer = () => {
  app.listen(PORTnoS, () => console.log("Server Listening on port: " + PORTnoS));
};

const startServerEncrypted = async () => {
  const sm = new SecretManagerServiceClient({
    projectId: "pftcxu",
    keyFilename: "./key.json",
  });

  const [pub] = await sm.accessSecretVersion({
    name: "projects/782692281082/secrets/PublicKey/versions/1",
  });

  const [prvt] = await sm.accessSecretVersion({
    name: "projects/782692281082/secrets/PrivateKey/versions/1",
  });

  const sslOptions = {
    key: prvt.payload.data.toString(),
    cert: pub.payload.data.toString(),
  };

  console.log(sslOptions);

  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log("Secure Server Listening on port:" + PORT);
  });
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use("auth", auth)

app.use("upload", upload)

// app.get("/login", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/login.html"));
// });

// app.get("/register", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/register.html"));
// });

// app.post("/login", (req, res) => {
//   const email = req.query.email;
//   const password = req.query.password;
//   requests++;
//   GetUser(email).then((r) =>{
//     console.log(r);
//     if(r.length === 1){
//       if(r[0].password === HashPassword(password)){
//         console.log("Login Pass")
//         res.send({ result: "success", email: email, name: r[0].name});
//       }else{
//         console.log("Login Fail")
//         res.send({ result: "fail", reason: "account password does not match"});
//       }  
//     }else{
//       console.log("Account does not exists")
//       res.send({ result: "fail", reason: "account does not exists"});
//     }
//   });
// });

// app.post("/register", (req, res) => {
//   const name = req.query.name;
//   const surname = req.query.surname;
//   const email = req.query.email;
//   const password = req.query.password;
//   requests++;

//   GetUser(email).then((r) =>{
//     if(r.length === 0){
//       CreateUser(name, surname, email, password).then((r) => {
//         //console.log(r);
//         res.send({ result: "success", name: name, surname: surname, email: email});
//       }).catch((e) => console.log(e));      
//     }else{
//       //console.log("Account already exists")
//       res.send({ result: "fail", reason: "account already exists"});
//     }
//   });  
// });

startServer();
startServerEncrypted();