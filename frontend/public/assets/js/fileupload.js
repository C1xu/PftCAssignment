const uploadFile = async () => {
    console.log("Button pressed");
    const fileUpload = document.getElementById("fileInput").files[0];
    if (fileUpload) {
      var formData = new FormData();
      const url = `/uploadJPG`;
      const headers = {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*",
      };
      formData.append("image", fileUpload);
      const response = await axios.post(url, formData, headers);
      console.log(response);
      reduceCredit();
    }
};

