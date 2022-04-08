import Express from "express";
import { OAuth2Client } from "google-auth-library";

const CLIENT_ID ="782692281082-ai1ji1h16eiu90p3bj9obmb7r5s2skno.apps.googleusercontent.com";;
const auth = Express.Router();
const client = new OAuth2Client(CLIENT_ID);

export default auth;

auth.route("/").post((req, res) => {
  const token = req.query.token;
  validateToken(token)
    .then((ticket) => {
      if (ticket.getPayload().name != null) {
        const payload = ticket.getPayload();
        res.send({
          status: "200",
          name: payload.name,
          email: payload.email,
          picture: payload.picture,
          token: token,
          expiry: payload.exp,
        });
        console.log(`${payload.name} has logged in.`);
      } else {
        res.send({ status: "401" });
      }
    })
    .catch((error) => {
      //console.log(error);
      console.log("Token timeout")
      res.send({ status: "401" });
    })
});

export const validateToken = async (token) => {
  return await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID
  });
}