import Express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import https from "https";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

import auth from "./routes/auth.js";
import upload from "./routes/upload.js";
import home from "./routes/home.js";
import clean from "./routes/home.js";
import { getTenPrice, getThirtyPrice, getTwentyPrice, setTenPrice, setThirtyPrice, setTwentyPrice } from "./db.js";

const DEV = false;
const PORT = DEV ? 80 : 443;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const sm = new SecretManagerServiceClient({
  projectId: "pftcxu",
  keyFilename: "./key.json",
});

export let PDF_API_KEY = "";

const startServer = async () => {
  const [pdf] = await sm.accessSecretVersion({
    name: "projects/782692281082/secrets/getOutAPI_key/versions/1",
  });
  PDF_API_KEY = pdf.payload.data.toString();

  if(!DEV){
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
    
    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log("Secure Server Listening on port:" + PORT);
    });
  }
  else{
    app.listen(PORT, () => console.log("Server Listening on port: " + PORT));
  }
};

const app = Express();
//enabled http -> https redirection
if (!DEV) {
  app.enable("trust proxy");
  app.use((req, res, next) => {
    req.secure ? next() : res.redirect("https://" + req.headers.host + req.url);
  });
}

//serve static files
app.use(Express.static(path.join(__dirname, "../frontend/public")));

//allow cross-origin reqs
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use("/auth", auth)

app.use("/upload", upload)

app.use("/clean", clean)

app.use("/home", home)

//Change json to getting price
app.post('/setTenPrice', (req, res) => {
  setTenPrice(req.query.Price);
})

app.post('/setTwentyPrice', (req, res) => {
  setTwentyPrice(req.query.Price);
})

app.post('/setThirtyPrice', (req, res) => {
  setThirtyPrice(req.query.Price);
})

app.get('/getTenPrice', (req, res) => {
  getTenPrice();
  return res.data;
})

app.get('/getTwentyPrice', (req, res) => {
  getTwentyPrice();
  return res.data;
})

app.get('/getThirtyPrice', (req, res) => {
  getThirtyPrice();
  return res.data;
})

startServer();