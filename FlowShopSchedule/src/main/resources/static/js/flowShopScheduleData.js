// const host = "http://127.0.0.1:8080"
const host = ""

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
                    let date = getDate(d);
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
                element.date = element.date == null ? null : getDate(element.date);
            });
            minDate = getDate(minDate);
            maxDate = getDate(maxDate);
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
            alert("查询订单错误，请联系管理员");
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
                alert("保存成功");
            }
        },
        error: function(error) {
            console.log(error);
            alert("保存失败，请联系管理员");
        }
    })
}

function exportExcel() {
    var xhr = new XMLHttpRequest();
    xhr.open("post", host + "/ArrangeProductionPlan/exportExcel", true);
    xhr.responseType = "blob";
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function(oEvent) {
        if (this.status == 200) {
            var content = this.response;
            var elink = document.createElement('a');
            elink.download = $("#currentFile").text();
            elink.style.display = 'none';

            var blob = new Blob([content]);
            elink.href = URL.createObjectURL(blob);

            document.body.appendChild(elink);
            elink.click();

            document.body.removeChild(elink);
        } else {
            console.log(this.response);
            alert("导出失败，请联系管理员");
        }
    };
    xhr.send(JSON.stringify({
        "fileNumber": $("#currentFile").text(),
        "start_date": start_date,
        "end_date": end_date,
        "date_num": date_num,
        "order_num": order_num,
        "production_quantity": production_quantity,
        "production_quantity_type": production_quantity_type,
        "max_production_quantity": max_production_quantity,
        "residual_production_quantity": residual_production_quantity,
        "default_production_quantity": default_production_quantity,
        "orders": orders
    }));
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
        url: host + "/ChooseFile/getFileList",
        async: false,
        type: "POST",
        success: function(fileNameList) {
            console.log(fileNameList);
            listAllFileName(fileNameList);
        },
        error: function(error) {
            console.log(error);
            alert("获取文件名错误，请联系管理员");
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
            alert("删除成功");
        },
        error: function(error) {
            console.log(error);
            alert("删除文件错误，请联系管理员");
        }
    })

}