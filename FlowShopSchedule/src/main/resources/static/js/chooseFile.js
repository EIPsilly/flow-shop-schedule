function showCandidates() {
    $("#fileList").show();
    fileName = $("#selectedFile").val();
    $("#fileList li").each(function() {
        if ($(this).text().search(new RegExp(fileName, 'i')) != -1) {
            $(this).css("display", "block");
        } else {
            $(this).css("display", "none");
        }
        console.log($(this).text().search(new RegExp(fileName, 'i')));
    })
}

function selectFile(item) {
    $("#fileList").toggle();
    item.siblings().removeClass("active");
    item.addClass("active");
    $("#selectedFile").val(item.children("p").text())
    $("#currentFile").text(item.children("p").text())
}

$("#selectedFile").bind("input propertychange", showCandidates);

$("#selectedFile").keydown(function(event) {
    console.log(event.which);
    let selected = $("#fileList li.active");
    if (event.which == 38) { //向上
        let prev = selected.prev();
        if (prev.length == 0) {
            prev = $("#fileList li").last();
        }
        prev.addClass("active");
        selected.removeClass("active");
    } else if (event.which == 40) { //向下
        let next = selected.next();
        if (next.length == 0) {
            next = $("#fileList li").first();
        }
        next.addClass("active");
        selected.removeClass("active");
    } else if (event.which == 13) { //回车
        selectFile(selected);
    }
});

$("#selectedFile").click(function() {
    $("#fileList").toggle();
    $("#selectedFile").val("");
    showCandidates();
})

$("#fileList li span").click(function(event) {
    event.stopPropagation();
    $(this).parent().remove();
    console.log();
})


$("#fileList li").click(function(event) {
    selectFile($(this));
})

$("#customFile").change(function(event) {
    let str = $(this).val();
    if (str !== "") {
        let arr = str.split("\\");
        let file_name = arr[arr.length - 1];
        // $(this).next("button").text(file_name);    
        let patt = /.xlsx$/;
        console.log(file_name);
        if (patt.test(file_name)) {
            $("#customFileLabel").text(file_name)
        } else {
            alert("请选择xlsx文件");
            $("#customFileLabel").text("上传文件");
            $(this).val("");
        }
    }
})

$("#uploadFile").click(function() {
    uploadFile();
})