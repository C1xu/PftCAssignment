let signInButton = document.getElementById("signIn");
let signOutButton = document.getElementById("signOut");
let profile = document.getElementById("profile");
let signInContainer = document.getElementById("signInContainer");

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
    `<div class="row mb-4">
    <div class="col-lg-8 mx-auto text-center">
        <h1 class="display-6">Bootstrap Payment Forms</h1>
    </div>
</div> <!-- End -->
<div class="row">
    <div class="col-lg-6 mx-auto">
        <div class="card ">
            <div class="card-header">
                <div class="bg-white shadow-sm pt-4 pl-2 pr-2 pb-2">
                    <!-- Credit card form tabs -->
                    <ul role="tablist" class="nav bg-light nav-pills rounded nav-fill mb-3">
                        <li class="nav-item"> <a data-toggle="pill" href="#credit-card" class="nav-link active "> <i class="fas fa-credit-card mr-2"></i> Credit Card </a> </li>
                        <li class="nav-item"> <a data-toggle="pill" href="#paypal" class="nav-link "> <i class="fab fa-paypal mr-2"></i> Paypal </a> </li>
                        <li class="nav-item"> <a data-toggle="pill" href="#net-banking" class="nav-link "> <i class="fas fa-mobile-alt mr-2"></i> Net Banking </a> </li>
                    </ul>
                </div> <!-- End -->
                <!-- Credit card form content -->
                <div class="tab-content">
                    <!-- credit card info-->
                    <div id="credit-card" class="tab-pane fade show active pt-3">
                        <form role="form" onsubmit="event.preventDefault()">
                            <div class="form-group"> <label for="username">
                                    <h6>Card Owner</h6>
                                </label> <input type="text" name="username" placeholder="Card Owner Name" required class="form-control "> </div>
                            <div class="form-group"> <label for="cardNumber">
                                    <h6>Card number</h6>
                                </label>
                                <div class="input-group"> <input type="text" name="cardNumber" placeholder="Valid card number" class="form-control " required>
                                    <div class="input-group-append"> <span class="input-group-text text-muted"> <i class="fab fa-cc-visa mx-1"></i> <i class="fab fa-cc-mastercard mx-1"></i> <i class="fab fa-cc-amex mx-1"></i> </span> </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-8">
                                    <div class="form-group"> <label><span class="hidden-xs">
                                                <h6>Expiration Date</h6>
                                            </span></label>
                                        <div class="input-group"> <input type="number" placeholder="MM" name="" class="form-control" required> <input type="number" placeholder="YY" name="" class="form-control" required> </div>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <div class="form-group mb-4"> <label data-toggle="tooltip" title="Three digit CV code on the back of your card">
                                            <h6>CVV <i class="fa fa-question-circle d-inline"></i></h6>
                                        </label> <input type="text" required class="form-control"> </div>
                                </div>
                            </div>
                            <div class="card-footer"> <button type="button" class="subscribe btn btn-primary btn-block shadow-sm"> Confirm Payment </button>
                        </form>
                    </div>
                </div> <!-- End -->
                <!-- Paypal info -->
                <div id="paypal" class="tab-pane fade pt-3">
                    <h6 class="pb-2">Select your paypal account type</h6>
                    <div class="form-group "> <label class="radio-inline"> <input type="radio" name="optradio" checked> Domestic </label> <label class="radio-inline"> <input type="radio" name="optradio" class="ml-5">International </label></div>
                    <p> <button type="button" class="btn btn-primary "><i class="fab fa-paypal mr-2"></i> Log into my Paypal</button> </p>
                    <p class="text-muted"> Note: After clicking on the button, you will be directed to a secure gateway for payment. After completing the payment process, you will be redirected back to the website to view details of your order. </p>
                </div> <!-- End -->
                <!-- bank transfer info -->
                <div id="net-banking" class="tab-pane fade pt-3">
                    <div class="form-group "> <label for="Select Your Bank">
                            <h6>Select your Bank</h6>
                        </label> <select class="form-control" id="ccmonth">
                            <option value="" selected disabled>--Please select your Bank--</option>
                            <option>Bank 1</option>
                            <option>Bank 2</option>
                            <option>Bank 3</option>
                            <option>Bank 4</option>
                            <option>Bank 5</option>
                            <option>Bank 6</option>
                            <option>Bank 7</option>
                            <option>Bank 8</option>
                            <option>Bank 9</option>
                            <option>Bank 10</option>
                        </select> </div>
                    <div class="form-group">
                        <p> <button type="button" class="btn btn-primary "><i class="fas fa-mobile-alt mr-2"></i> Proceed Payment</button> </p>
                    </div>
                    <p class="text-muted">Note: After clicking on the button, you will be directed to a secure gateway for payment. After completing the payment process, you will be redirected back to the website to view details of your order. </p>
                </div> <!-- End -->
                <!-- End -->
            </div>
        </div>
    </div>`
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