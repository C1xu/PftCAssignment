import Express from "express";
import { Storage  } from "@google-cloud/storage";
const clean = Express.Router();

const bucketName = "pftcxu.appspot.com";

const storage = new Storage({
    projectId: 'pftcxu',
    keyFilename: './key.json'
})

clean.route("/").post((req,res) => {
    
});

export default clean;