// 标签页切换
$("#chooseFileButton").click(function() {
    $(this).tab('show');
})

// 选中一个文件时
function selectFile(item) {
    $("#fileList").toggle();
    item.siblings().removeClass("active");
    item.addClass("active");
    $("#selectedFile").val(item.children("p").text())
    $("#currentFile").text(item.children("p").text())
}

// 输入框内容改变时修改 文件列表内容
$("#selectedFile").bind("input propertychange", function showCandidates() {
    $("#fileList").show();
    fileName = $("#selectedFile").val();
    $("#fileList li").each(function() {
        if ($(this).text().search(new RegExp(fileName, 'i')) != -1) {
            $(this).css("display", "block");
        } else {
            $(this).css("display", "none");
        }
        // console.log($(this).text().search(new RegExp(fileName, 'i')));
    })
});

// 上下选择文件
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

// 点击输入框
$("#selectedFile").click(function() {
    $("#fileList").toggle();
    $("#selectedFile").val("");
})

// 删除文件
$("#fileList").on("click", "li span", function(event) {
    event.stopPropagation();
    let li = $(this).parent();
    deleteByFileName(li.children("p").text());
    if (li.attr("class").search("active") != -1) {
        $("#currentFile").text("")
    }
    console.log(li.attr("class").search("active"));
    li.remove();
})

// 点击文件时
$("#fileList").on("click", "li", function() {
    selectFile($(this));
})

// 选择要上传的文件
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

// 上传文件按钮被点击
$("#uploadFile").click(function() {
    uploadFile();
})

// 获取数据库内的所有文件名
function listAllFileName(fileNameList) {
    $("#fileList").html("")
    for (let idx in fileNameList) {
        console.log(idx);
        $("#fileList").append(
            `<li class="list-group-item">
        <p>` + fileNameList[idx] + `</p>
        <span>&times;</span>
        </li>`);
    }
}