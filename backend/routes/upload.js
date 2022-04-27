import Express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import * as Storage from "@google-cloud/storage";

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

async function uploadToBucket(file) {
    await storage.bucket("pftcxu.appspot.com").upload(file , {
        destination: "pending/" + file.path.originalname,
    });
}

upload.route("/").post(imageUpload.single("image"), (req, res) => {
    if(req.file){
        console.log("File downloaded at: " + req.file.path);
        
        uploadToBucket(req.file.path).catch(console.error);
        
        res.send({
            status: "200",
            message: "File uploaded successfully! Processing..",
        });
    }
    //receive the image  Done?
    //convert it to base64  Done?
    //save it in cloud storage
    //send it to getoutpdf API
});
  
export default upload;