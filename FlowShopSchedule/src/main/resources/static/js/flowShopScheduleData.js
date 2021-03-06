// var host = "http://127.0.0.1:8080"
var host = ""

// arrangeProductionPlan.js

function getOrderByFileName() {
    $.ajax({
        url: host + "/ArrangeProductionPlan/getBlenderOrderByFileNumber",
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
            let maxDate = 0,
                minDate = 9999999999999;
            let tmp = function(d) {
                if (d != null) {
                    let date = new Date(d);
                    minDate = Math.min(date.getTime(), minDate);
                    maxDate = Math.max(date.getTime(), maxDate);
                    return date;
                } else {
                    return null;
                }
            }
            orders.forEach(element => {
                element.plannedEndDate = tmp(element.plannedEndDate);
                element.plannedStartDate0 = tmp(element.plannedStartDate0);
                element.plannedStartDate1 = tmp(element.plannedStartDate1);
            });
            schedule.forEach(element => {
                element.date = element.date == null ? null : new Date(element.date);
            });
            minDate = new Date(minDate);
            maxDate = new Date(maxDate);
            $("#startDate").val(minDate.getFullYear() + "-" + (minDate.getMonth() + 1) + "-1");
            let endDateStr = maxDate.getFullYear() + "-" + (maxDate.getMonth() + 1) + "-";
            if ((maxDate.getMonth() + 1 == 2) &&
                ((maxDate.getFullYear() % 4 == 0 && maxDate.getFullYear() % 100 != 0) ||
                    (maxDate.getFullYear() % 400 == 0))) {
                endDateStr += "29";
            } else {
                endDateStr += days_in_month[maxDate.getMonth()];
            }
            $("#endDate").val(endDateStr);
            reloadTheSchedule();
            $("#arrangeProductionButton").tab('show');
        },
        error: function(error) {
            console.log(error);
            alert("???????????????????????????????????????");
        }
    })
}

function saveArrange() {
    $.ajax({
        url: host + "/ArrangeProductionPlan/saveArrange",
        type: "POST",
        data: JSON.stringify({
            "orders": orders,
            "schedule": schedule,
            "fileNumber": $("#currentFile").text()
        }),
        aysnc: true,
        contentType: "application/json",
        success: function(res) {
            console.log(res);
            if (res == "success") {
                alert("????????????");
            }
        },
        error: function(error) {
            console.log(error);
            alert("?????????????????????????????????");
        }
    })
}

// chooseFile.js

function uploadFile() {
    var formData = new FormData();
    formData.append("file", $("#customFile")[0].files[0]);
    console.log(formData);
    $.ajax({
        url: host + "/ChooseFile/uploadFile",
        type: "POST",
        data: formData,
        contentType: false,
        processData: false,
        success: function(res) {
            console.log(res);
            $("#currentFile").text(res.split(":")[1])
            getFileList()
            alert("????????????");
        },
        error: function(error) {
            console.log(error);
            alert("?????????????????????????????????");
        }
    })
}

function getFileList() {
    $.ajax({
        url: host + "/ChooseFile/getFileList",
        async: false,
        type: "POST",
        success: function(fileNameList) {
            console.log(fileNameList);
            listAllFileName(fileNameList);
        },
        error: function(error) {
            console.log(error);
            alert("??????????????????????????????????????????");
        }
    })
}

function deleteByFileName(fileName) {
    $.ajax({
        url: host + "/ChooseFile/deleteFile",
        data: {
            "fileNumber": fileName
        },
        aysnc: false,
        type: "GET",
        contentType: "application/json",
        success: function(res) {
            console.log(res);
            alert("????????????");
        },
        error: function(error) {
            console.log(error);
            alert("???????????????????????????????????????");
        }
    })

}