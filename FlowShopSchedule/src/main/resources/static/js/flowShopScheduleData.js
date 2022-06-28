function uploadFile() {
    var formData = new FormData();
    formData.append("file", $("#customFile")[0].files[0]);
    console.log(formData);
    $.ajax({
        url: "http://127.0.0.1:8080/ChooseFile/uploadFile",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function(res) {
            console.log(res);
            $("#currentFile").text("Upload file success:阿斯蒂芬as.xlsx".split(":")[1])
            alert("上传成功");
        },
        error: function(error) {
            console.log(error);
            alert("上传错误，请联系管理员");
        }
    })
}