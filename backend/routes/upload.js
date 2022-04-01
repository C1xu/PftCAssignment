import Express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import {Storage} from '@google-cloud/storage';

// The ID of your GCS bucket
const bucketName = 'pftcxu.appspot.com/pending';
// The path to your file to upload
const filePath = '../uploads/';
// The new ID for your GCS file
const destFileName = 'test1';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const storage = new Storage();

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

async function uploadToBucket() {
    await storage.bucket(bucketName).upload(filePath, {
        destination: destFileName,
    });
    console.log(`${filePath} uploaded to ${bucketName}`);
}

upload.route("/").post(imageUpload.single("image"), (req, res) => {
    if(req.file){
        console.log("File downloaded at: " + req.file.path);
        
        uploadToBucket().catch(console.error);

        // let base64String = "";
        // var reader = new FileReader();

        // reader.onload = function () {
        //     base64String = reader.result.replace("data:", "")
        //         .replace(/^.+,/, "");
    
        //     imageBase64Stringsep = base64String;
    
        //     console.log(base64String);
        // }
        // reader.readAsDataURL(req.query.formData);
        
        let bufferObj = Buffer.from(req, "utf8");
        let base64String = bufferObj.toString("base64");
        
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