import Express, { json } from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { Storage } from "@google-cloud/storage";
import { PubSub } from "@google-cloud/pubsub";
import fs from "fs";
import axios from "axios";
import { PDF_API_KEY } from "../index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const storage = new Storage({ projectId: 'pftcxu', keyFilename: './key.json' });
const pubSub = new PubSub({ projectId: 'pftcxu', keyFilename: './key.json' });

const upload = Express.Router();

let fileUpload = multer({
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
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg" && ext !== ".doc" && ext !== ".docx") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
  limits: {
    fileSize: 2621441,
  },
});

// async function transferToPubSub(payload) {
//   const buffer = Buffer.from(JSON.stringify(payload), "utf8");
//   pubSub.topic("queue_sub").publish(buffer, {}, callback);
// }


upload.route("/").post(fileUpload.single("image"), async function (req, res) {
  if (req.file) {
    console.log("File downloaded at: " + req.file.path);

    //Upload to google cloud, pending bucket
    await storage.bucket("pftcxu.appspot.com").upload(req.file.path, {
      destination: "pending/" + req.file.originalname,
    });

    // Tried PubSub
    // await transferToPubSub({
    //   email: email,
    //   filename: req.file.originalname,
    //   date: new Date().toUTCString,
    //   pending: "pftcxu.appspot.com/pending/" + req.file.originalname,
    // });

    //Convert to base64
    var base64file = fs.readFileSync(req.file.path, 'base64');
    var url = "";
    var headers = {};

    var ext = path.extname(`${req.file.originalname}`);
    if (ext == ".png" || ext == ".jpg" || ext == ".gif" || ext == ".jpeg") {
      url = "https://getoutpdf.com/api/convert/image-to-pdf"
      headers = {
        "api_key": PDF_API_KEY,
        "image": base64file,
      }
    } else if (ext == ".doc" || ext == ".docx") {
      url = "https://getoutpdf.com/api/convert/document-to-pdf"
      headers = {
        "api_key": PDF_API_KEY,
        "image": base64file,
      }
    }

    const response = await axios.post(url, headers);
    //console.log(response);
    //console.log(response.data.pdf_base64);

    //Convert back to file
    var convertedFile = Buffer.from(response.data.pdf_base64, 'base64');

    //Upload to google cloud, completed bucket
    await storage.bucket("pftcxu.appspot.com").file("completed/" + req.file.originalname.substring(0, req.file.originalname.lastIndexOf(".")) + ".pdf").save(convertedFile);
    res.send({
      status: "200",
      message: "File uploaded successfully! Processing..",
      link: "https://storage.cloud.google.com/pftcxu.appspot.com/completed/" + req.file.originalname.substring(0, req.file.originalname.lastIndexOf(".")),
    });
  }
});

export default upload;