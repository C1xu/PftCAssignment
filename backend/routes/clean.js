import Express from "express";
import { Storage } from "@google-cloud/storage";
const clean = Express.Router();

const bucketName = "pftcxu.appspot.com";

const storage = new Storage({
    projectId: 'pftcxu',
    keyFilename: './key.json'
})

clean.route("/").post(async (req,res) => {
    const [files] = await storage.bucket(bucketName).getFiles();
    files.forEach(file => {
        if(new Date(file.metadata.timeCreated) < Date.now() - (86400000)){
            file.delete();
        }
    });
});

export default clean;