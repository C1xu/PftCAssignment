import Express, { response } from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import https from "https";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

import auth from "./routes/auth.js";
import upload from "./routes/upload.js";
import home from "./routes/home.js";
import clean from "./routes/home.js";
import { buyCredits, CreateUser, getTenPrice, getThirtyPrice, getTwentyPrice, GetUser, setTenPrice, setThirtyPrice, setTwentyPrice } from "./db.js";

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
  app.use(Express.json());
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

app.post('/buyCredits', async (req, res) => {
  const amount = req.query.Amount;
  const email = req.query.Email;
  await buyCredits(amount, email).then(async (response) => {
    if(response == true){
      res.send({Paid: true})
    }
  });
})

app.post('/checkUserExists', async (req,res) => {
  const email = req.query.Email;
  GetUser(email).then(async(response) => {
    if(response.length > 0)
      res.send({Credits: response[0].credits, Admin: response[0].admin})
    else{
      const newUser = await CreateUser(email);
      res.send({Credits: newUser.credits, Admin: newUser.admin})
    }
  })
})

app.post('/getUserCredits', async (req,res) => {
  const email = req.query.Email;
  GetUser(email).then(async(response) => {
    if(response.length > 0)
      res.send({Credits: response[0].credits})
  })
})
// app.post('/createUser', async (req, res) => {
//   await CreateUser(req.query.Email);
// })
// app.post('/getUser', async (req, res) => {
//   await GetUser(req.query.Email);
// })
// app.post('getAdmin', async (req, res) =>{
//   var adminCheck = await GetUserAdminInfo();
//   res.send({admin: adminCheck})
// })
// app.post('getCredits', async (req, res) => {
//   var creditAmount = await GetUserCredits();
//   res.send({credits: creditAmount})
// })

// Allows admin to change prices of credits
app.post('/setTenPrice', (req, res) => {
  setTenPrice(req.query.Price);
})
app.post('/setTwentyPrice', (req, res) => {
  setTwentyPrice(req.query.Price);
})
app.post('/setThirtyPrice', (req, res) => {
  setThirtyPrice(req.query.Price);
})

// Allows users to check prices of credits
app.post('/getTenPrice', async (req, res) => {
  var tenPrice = await getTenPrice();
  res.send({price: tenPrice})
})
app.post('/getTwentyPrice', async (req, res) => {
  var twentyPrice = await getTwentyPrice();
  res.send({price: twentyPrice})
})
app.post('/getThirtyPrice', async (req, res) => {
  var thirtyPrice = await getThirtyPrice();
  res.send({price: thirtyPrice})
})

startServer();