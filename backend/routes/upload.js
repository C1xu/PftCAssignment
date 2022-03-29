import Express from "express";

const upload = Express.Router();

upload.route("/").post((req, res) => {

    let base64String = "";
    var reader = new FileReader();

    reader.onload = function () {
        base64String = reader.result.replace("data:", "")
            .replace(/^.+,/, "");
  
        imageBase64Stringsep = base64String;
  
        console.log(base64String);
    }
    reader.readAsDataURL(req.query.formData);

    //receive the image  Done?
    //convert it to base64  Done?
    //save it in cloud storage
    //send it to getoutpdf API
});
  
export default upload;