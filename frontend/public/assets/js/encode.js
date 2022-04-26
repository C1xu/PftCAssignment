const encode = async () => {
    var selectedfile = document.getElementById("fileInput").files;
    if (selectedfile.length > 0) {
      var imageFile = selectedfile[0];
      var fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent) {
        var srcData = fileLoadedEvent.target.result;
        var newImage = document.createElement('img');
        newImage.src = srcData;
        document.getElementById("imagePlacement").innerHTML = newImage.outerHTML;
        //document.getElementById("txt").value = document.getElementById("imagePlacement").innerHTML;
      }
      fileReader.readAsDataURL(imageFile);
    }
  }