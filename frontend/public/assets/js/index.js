let signInButton = document.getElementById("signIn");
let signOutButton = document.getElementById("signOut");
let profile = document.getElementById("profile");
let signInContainer = document.getElementById("signInContainer");

//import { CreateUser, GetUser } from "../../../../backend/db";
import { rConnect } from "../../../../backend/db";

rConnect();

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
    <button type="button" class="btn btn-primary launch" onclick="Charge10()"> <i class="fa fa-rocket"></i> 10 Credits </button>
    <button type="button" class="btn btn-primary launch"> <i class="fa fa-rocket"></i> 20 Credits </button>
    <button type="button" class="btn btn-primary launch"> <i class="fa fa-rocket"></i> 30 Credits </button>

    <span id="costText"> Cost </span>
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
  document.getElementById("costText").innerHTML = "Cost = $10";
}

function twentyCredits(){
  document.getElementById("costText").innerHTML = "Cost = $15";
}

function thirtyCredits(){
  document.getElementById("costText").innerHTML = "Cost = $20";
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
