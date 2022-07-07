// arrangeProductionPlan.js

function getOrderByFileName() {
    have_got_order_by_file_name = false;
    $.ajax({
        url: "http://127.0.0.1:8080/ArrangeProductionPlan/getBlenderOrderByFileNumber",
        type: "GET",
        data: {
            "fileNumber": $("#currentFile").text()
        },
        aysnc: true,
        contentType: "application/json",
        success: function(res) {
            console.log(res);
            orders = res["blenderOrders"];
            schedule = res["schedules"];
            orders.forEach(element => {
                element.plannedEndDate = element.plannedEndDate == null ? null : new Date(element.plannedEndDate);
                element.plannedStartDate0 = element.plannedStartDate0 == null ? null : new Date(element.plannedStartDate0);
                element.plannedStartDate1 = element.plannedStartDate1 == null ? null : new Date(element.plannedStartDate1);
            });
            schedule.forEach(element => {
                element.date = element.date == null ? null : new Date(element.date);
            });
            reloadTheSchedule();
            scheduleCellClick("#order_list");
            scheduleCellClick("#scheduleList0");
            scheduleCellClick("#scheduleList1");
            $("#arrangeProductionButton").tab('show');
        },
        error: function(error) {
            console.log(error);
            alert("查询订单错误，请联系管理员");
        }
    })
}

// chooseFile.js

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
            $("#currentFile").text(res.split(":")[1])
            getFileList()
            alert("上传成功");
        },
        error: function(error) {
            console.log(error);
            alert("上传错误，请联系管理员");
        }
    })
}

function getFileList() {
    $.ajax({
        url: "http://127.0.0.1:8080/ChooseFile/getFileList",
        async: false,
        type: "POST",
        success: function(fileNameList) {
            console.log(fileNameList);
            listAllFileName(fileNameList);
        },
        error: function(res) {
            console.log(error);
            alert("获取文件名错误，请联系管理员");
        }
    })
}

function deleteByFileName(fileName) {
    $.ajax({
        url: "http://127.0.0.1:8080/ChooseFile/deleteFile",
        data: {
            "fileNumber": fileName
        },
        aysnc: false,
        type: "GET",
        contentType: "application/json",
        success: function(res) {
            console.log(res);
            alert("删除成功");
        },
        error: function(error) {
            console.log(error);
            alert("删除文件错误，请联系管理员");
        }
    })

}