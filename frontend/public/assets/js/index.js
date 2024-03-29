let signInButton = document.getElementById("signIn");
let signOutButton = document.getElementById("signOut");
let profile = document.getElementById("profile");
let signInContainer = document.getElementById("signInContainer");

let localAdmin = false;
let localCredits = 0;
let amount = 0;
let localEmail = "";

const authenticateReq = async (token) => {
  const url = `/auth?token=${token}`;
  const headers = {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
  };
  const response = await axios.post(url, headers);
  const status = response.data.status;

  if (status == 200) {
    const name = response.data.name;
    const email = response.data.email;
    const picture = response.data.picture;
    const expiry = response.data.expiry;
    localEmail = email;
    checkIfUserExists(email);
    profile.style.display = "inline";
    signInContainer.style.display = "none";

    document.getElementById("home-container").innerHTML = '<a class="nav-link active" aria-current="page"></a>'
    document.getElementById("navbarDropdownMenuLink").innerHTML = '<img id="picture" src="" class="rounded-circle" style="margin-right: 5px" height="25" alt="" loading="lazy"/>' + name;
    document.getElementById("inputConvertFileButtons").innerHTML = 
    `
    <button id="JPG to PDF" type="button" class="btn btn-success" onclick="convertJPG()">Convert JPG</button>
    <button id="Doc to PDF" type="button" class="btn btn-success" onclick="convertDoc()">Convert Doc</button>
    `
    document.getElementById("picture").src = picture;
    let date = new Date();
    date.setTime(date.getTime() + expiry)
    document.cookie = `token=${token};expires=${date.toUTCString()}`;
    console.log(`${name} signed in successfully.`);
  } else {
    profile.style.display = "none";
    signInContainer.style.display = "inline";
  }
};

function convertJPG(){
  document.getElementById("inputConvertFileDiv").innerHTML = '<input id="fileInput" class="form-control" type="file" id="formFile" accept="image/*"/>';
  document.getElementById("inputConvertFileButton").innerHTML = '<button id="convert" type="button" class="btn btn-primary" onclick="uploadFile(); reduceCredit();"> Convert </button>';
}
function convertDoc(){
  document.getElementById("inputConvertFileDiv").innerHTML = '<input id="fileInput" class="form-control" type="file" id="formFile" accept=".doc, .docx,"/>';
  document.getElementById("inputConvertFileButton").innerHTML = '<button id="convert" type="button" class="btn btn-primary" onclick="uploadFile(); reduceCredit();"> Convert </button>';
}

function goToCredits(){
  document.getElementById("convertSection").style="display:none";
  document.getElementById("creditsSection").style="display:inline";
}
function goToConvert(){
  document.getElementById("convertSection").style="display:inline";
  document.getElementById("creditsSection").style="display:none";
}

//Set Price dependant on redis price set by admin
async function tenCredits(){
  var price = await getTenPrice();
  document.getElementById("costText").innerText = "10 Credits Cost = $" + price;
  amount = 10;
}
async function twentyCredits(){
  var price = await getTwentyPrice();
  document.getElementById("costText").innerText = "20 Credits Cost = $" + price;
  amount = 20;
}
async function thirtyCredits(){
  var price = await getThirtyPrice();
  document.getElementById("costText").innerText = "30 Credits Cost = $" + price;
  amount = 30;
}

async function checkIfUserExists(email){
  await axios.post("/checkUserExists?Email=" + email)
  .then(async function (response) {
    console.log(response);
    localAdmin = response.data.Admin;
    localCredits = response.data.Credits;
    document.getElementById("Credits").innerText = "Credits: " + localCredits; 
    if(localAdmin){
      document.getElementById("creditsDiv").innerHTML = 
    `
    <div>
      <button type="button" class="btn btn-primary launch" onclick="tenCredits()"> <i class="fa fa-rocket"></i> 10 Credits </button>
      <button type="button" class="btn btn-primary launch" onclick="twentyCredits()"> <i class="fa fa-rocket"></i> 20 Credits </button>
      <button type="button" class="btn btn-primary launch" onclick="thirtyCredits()"> <i class="fa fa-rocket"></i> 30 Credits </button>
    </div>
    <div>
      <span id="costText"> Cost </span>
    </div>
    <div>
      <button type="button" class="btn btn-primary launch" onclick="pay()"> <i class="fa fa-rocket"></i> Pay </button>
    </div>
    <div id="adminDiv">
      <div class="input-group mb-3">
        <span class="input-group-text">$</span>
          <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)" id="adminChangeTen">
          <button type="button" class="btn btn-primary launch" onclick="setTen()"> <i class="fa fa-rocket"></i> Set 10 </button>
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text">$</span>
          <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)" id="adminChangeTwenty">
          <button type="button" class="btn btn-primary launch" onclick="setTwenty()"> <i class="fa fa-rocket"></i> Set 20 </button>
      </div>
      <div class="input-group mb-3">
        <span class="input-group-text">$</span>
          <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)" id="adminChangeThirty">
          <button type="button" class="btn btn-primary launch" onclick="setThirty()"> <i class="fa fa-rocket"></i> Set 30 </button>
      </div>
    </div>
    `
    }else{
      document.getElementById("creditsDiv").innerHTML = 
    `
    <div>
      <button type="button" class="btn btn-primary launch" onclick="tenCredits()"> <i class="fa fa-rocket"></i> 10 Credits </button>
      <button type="button" class="btn btn-primary launch" onclick="twentyCredits()"> <i class="fa fa-rocket"></i> 20 Credits </button>
      <button type="button" class="btn btn-primary launch" onclick="thirtyCredits()"> <i class="fa fa-rocket"></i> 30 Credits </button>
    </div>
    <div>
      <span id="costText"> Cost </span>
    </div>
    <div>
      <button type="button" class="btn btn-primary launch" onclick="pay()"> <i class="fa fa-rocket"></i> Pay </button>
    </div>
    `
    }
  })
  .catch(function (error) {
    console.log(error);
  })
}

async function pay(){
  if(amount!= 0){
    await axios.post("/buyCredits?Amount=" + amount + "&Email="+localEmail)
    .then(async function (response) {
      console.log(response);
      getCredits(localEmail);
    })
    .catch(function (error) {
      console.log(error);
    })
  }
}

async function reduceCredit(){
  await axios.post("/useCredit?Email="+localEmail)
    .then(async function (response) {
      console.log(response);
      getCredits(localEmail);
    })
    .catch(function (error) {
      console.log(error);
    })
}

async function getCredits(email){
  await axios.post("/getUserCredits?Email="+ email)
    .then(async function (response) {
      console.log(response);
      localCredits = response.data.Credits;
      document.getElementById("Credits").innerText = "Credits: " + localCredits; 
    })
    .catch(function (error) {
      console.log(error);
    })
}

function setTen(){
  var price = document.getElementById("adminChangeTen").value;
  axios.post("/setTenPrice?Price=" + price)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
}
function setTwenty(){
  var price = document.getElementById("adminChangeTwenty").value;
  axios.post("/setTwentyPrice?Price=" + price)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
}
function setThirty(){
  var price = document.getElementById("adminChangeThirty").value;
  axios.post("/setThirtyPrice?Price=" + price)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
}

async function getTenPrice(){
  return await axios.post("/getTenPrice")
  .then(async function (response) {
    console.log(response);
    console.log(response.data.price);
    return response.data.price;
  })
  .catch(function (error) {
    console.log(error);
  })
}
async function getTwentyPrice(){
  return await axios.post("/getTwentyPrice")
  .then(async function (response) {
    console.log(response);
    console.log(response.data.price);
    return response.data.price;
  })
  .catch(function (error) {
    console.log(error);
  })
}
async function getThirtyPrice(){
  return await axios.post("/getThirtyPrice")
  .then(async function (response) {
    console.log(response);
    console.log(response.data.price);
    return response.data.price;
  })
  .catch(function (error) {
    console.log(error);
  })
}

async function loadGoogleLogin() {
  let session = document.cookie;
  if (session && session.includes("token")) {
    authenticateReq(session.split("token=")[1].split(";")[0]);
  } else {
    profile.style.display = "none";
    signInContainer.style.display = "inline";
  }

  const signOut = () => {
    let auth2 = gapi.auth2.getAuthInstance();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    auth2
      .signOut()
      .then(() => {
        profile.style.display = "none";
        signInContainer.style.display = "inline";
        document.getElementById("home-container").innerHTML = '';
        document.getElementById("inputConvertFileDiv").innerHTML = '';
        document.getElementById("inputConvertFileButton").innerHTML = '';
        console.log("User signed out.");
      })
      .catch((error) => alert(error));
  };

  signOutButton.addEventListener("click", () => signOut());

  gapi.load("auth2", () => {
    // Retrieve the singleton for the GoogleAuth library and set up the client.
    let auth2 = gapi.auth2.init({
      client_id:
        "782692281082-ai1ji1h16eiu90p3bj9obmb7r5s2skno.apps.googleusercontent.com",
      cookiepolicy: "single_host_origin",
      scope: "profile",
    });

    auth2.attachClickHandler(
      signInButton,
      {},
      function (googleUser) {
        authenticateReq(googleUser.getAuthResponse().id_token);
      },
      function (error) {
        alert(
          "Error: " + JSON.parse(JSON.stringify(error, undefined, 2)).error
        );
      }
    );
  });
}
