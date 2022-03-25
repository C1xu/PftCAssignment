function loadGoogleLogin() {
    let signInButton = document.getElementById("signIn");
    let signOutButton = document.getElementById("signOut");
  
    const signOut = () => {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2
        .signOut()
        .then(() => {
          signOutButton.hidden = true;
          signInButton.hidden = false;
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
          signInButton.hidden = true;
          signOutButton.hidden = false;
          var profile = googleUser.getBasicProfile();
          console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
          console.log("Name: " + profile.getName());
          console.log("Image URL: " + profile.getImageUrl());
          console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
        },
        function (error) {
          alert(
            "Error: " + JSON.parse(JSON.stringify(error, undefined, 2)).error
          );
        }
      );
    });
}