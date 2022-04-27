import Express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import * as Storage from "@google-cloud/storage";
import fs from "fs";
import axios from "axios";
import { PDF_API_KEY } from "backend\index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const storage = new Storage.Storage({projectId: 'pftcxu', keyFilename: './key.json'});

const upload = Express.Router();

let imageUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../uploads/"));
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 2621441,
  },
});

upload.route("/").post(imageUpload.single("image"), async function (req, res){
    if(req.file){
        console.log("File downloaded at: " + req.file.path);

        //Upload to google cloud
        await storage.bucket("pftcxu.appspot.com").upload(req.file.path, {
          destination: "pending/" + req.file.originalname,
        });
        
        //Convert to base64
        var base64file =  fs.readFileSync(req.file.path, 'base64');

        //Send to API
        const url = "https://getoutpdf.com/api/convert/image-to-pdf"
        const headers = {
          "api_key": PDF_API_KEY,
          "image": base64file,
        }
        const response = axios.post(url,headers); 
        console.log(response);

        res.send({
            status: "200",
            message: "File uploaded successfully! Processing..",
        });
    }
    //send it to getoutpdf API
});
  
export default upload;