//import { getTenPrice, getTwentyPrice, getThirtyPrice, setTenPrice } from "../../../../backend/db.js";

let signInButton = document.getElementById("signIn");
let signOutButton = document.getElementById("signOut");
let profile = document.getElementById("profile");
let signInContainer = document.getElementById("signInContainer");

//import { CreateUser, GetUser } from "../../../../backend/db";

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
    profile.style.display = "inline";
    signInContainer.style.display = "none";

    document.getElementById("home-container").innerHTML = '<a class="nav-link active" aria-current="page"></a>'
    document.getElementById("inputConvertFileDiv").innerHTML = '<input id="fileInput" class="form-control" type="file" id="formFile" accept="image/*"/>'
    document.getElementById("inputConvertFileButton").innerHTML = '<button id="convert" type="button" class="btn btn-primary" onclick="uploadFile()"> Convert </button>'
    document.getElementById("navbarDropdownMenuLink").innerHTML = '<img id="picture" src="" class="rounded-circle" style="margin-right: 5px" height="25" alt="" loading="lazy"/>' + name;
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

function goToCredits(){
  document.getElementById("convertSection").style="display:none";
  document.getElementById("creditsSection").style="display:inline";
}

function goToConvert(){
  document.getElementById("convertSection").style="display:inline";
  document.getElementById("creditsSection").style="display:none";
}

//Set Price dependant on redis price set by admin
function tenCredits(){
  var price = getTenPrice();
  document.getElementById("costText").innerText = "10 Credits Cost = $" + price;
}

function twentyCredits(){
  var price = getTwentyPrice();
  document.getElementById("costText").innerText = "20 Credits Cost = $" + price;
}

function thirtyCredits(){
  var price = getThirtyPrice();
  document.getElementById("costText").innerText = "30 Credits Cost = $" + price;
}

function setTen(){
  const price = document.getElementById("adminChangeTen").value;
  axios.post("/setTenPrice?Price=" + price)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
}

function setTwenty(){
  const price = document.getElementById("adminChangeTwenty").value;
  axios.post("/setTwentyPrice?Price=" + price)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
}

function setThirty(){
  const price = document.getElementById("adminChangeThirty").value;
  axios.post("/setThirtyPrice?Price=" + price)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
}

function getTenPrice(){
  const response = await axios.get("/getTenPrice");
  return response.data;
}

function getTwentyPrice(){
  axios.get("/getTwentyPrice")
  .then(function (response) {
    console.log(response);
    return response;
  })
  .catch(function (error) {
    console.log(error);
  })
}

function getThirtyPrice(){
  axios.get("/getThirtyPrice")
  .then(function (response) {
    console.log(response);
    return response;
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
