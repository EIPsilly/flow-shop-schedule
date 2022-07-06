// 标签页切换
$("#scheduleDiagramButton").click(function() {
    if ($("#currentFile").text() == "尚未选择") {
        alert("请选择文件");
    } else {
        $(this).tab('show');
    }
})