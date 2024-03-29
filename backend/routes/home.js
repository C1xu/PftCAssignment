import Express from "express";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { validateToken } from "./auth.js";

const home = Express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

home.route("/").get((req, res) => {
    const token = req.query.token;

    validateToken(token)
    .then((ticket) => {
        if(ticket.getPayload().name != null){
            res.sendFile(path.join(__dirname, "../../frontend/index.html"));
        } else {
            res.redirect("/");
        }
    })
    .catch((error) => {
        console.log("Token timeout")
        res.redirect("/");
    });
});

export default home;