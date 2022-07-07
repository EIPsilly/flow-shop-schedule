var have_got_order_by_file_name = false;

// 标签页切换
$("#arrangeProductionButton").click(function() {
    if ($("#currentFile").text() == "尚未选择") {
        alert("请选择文件");
    } else {
        getOrderByFileName();
    }
})

var orders, schedule, identity_to_row_index, current_schedule_index = 0;
var weekday = ["日", "一", "二", "三", "四", "五", "六"];
var month = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
var date_patt = /^[0-9]{4}-([1-9]|0[1-9]|1[0-2])-([1-9]|0[1-9]|[12][0-9]|3[01])$/;
var start_date = new Date(2022, 5, 1);
var end_date = new Date(2022, 5, 20);
var date_num = 0;
var order_num = 0;
var cell_move_flag = true; //控制单元格是否移动
var production_quantity = new Array();
var max_production = new Array();
var residual_production_quantity = new Array();
var default_production = 2000;

// 流水表开始日期
$("#startDate").blur(function() {
    let str = $(this).val()
    if (date_patt.test(str) == false) {
        $("#startDateInputMessage").html("请输入正确日期");
        $(this).focus();
    } else {
        $("#startDateInputMessage").html("<br/>")
    }
})

// 流水表结束日期
$("#endDate").blur(function() {
    let str = $(this).val()
    if (date_patt.test(str) == false) {
        $("#endDateInputMessage").html("请输入正确日期");
        $(this).focus();
    } else {
        $("#endDateInputMessage").html("<br/>")
    }
})

$("#endDate").keydown(function(event) {
    event.stopPropagation();
    if (event.keyCode == 13) {
        reloadTheSchedule();
    }
})

$("#startDate").keydown(function(event) {
    event.stopPropagation();
    if (event.keyCode == 13) {
        reloadTheSchedule();
    }
})

$("#createScheduleListTable").click(function() {
    reloadTheSchedule();
});

$("#switchPipeline").click(function() {
    $(".scheduleList").toggle();
    current_schedule_index = 1 - current_schedule_index;
    reloadTheSchedule();
})

// 初始化生产数量安排表、最大数量表、剩余数量表
function initSchedule() {
    order_num = orders.length;
    start_date = new Date($("#startDate").val());
    end_date = new Date($("#endDate").val());
    date_num = Math.ceil((end_date - start_date) / 3600 / 1000 / 24) + 1;

    for (let table_index = 0; table_index < $(".scheduleList").length; table_index++) {
        production_quantity[table_index] = new Array();
        for (let row = 0; row < order_num; row++) {
            production_quantity[table_index][row] = new Array();
            for (let col = 0; col < date_num; col++) {
                production_quantity[table_index][row][col] = 0;
            }
        }
        max_production[table_index] = new Array();
        residual_production_quantity[table_index] = new Array();
        for (let col = 0; col < date_num; col++) {
            max_production[table_index][col] = default_production;
            residual_production_quantity[table_index][col] = default_production;
        }
    }
}


// 将生产订单转换成生产数量表
function convertScheduleToProductionQuantity() {
    start_date = new Date($("#startDate").val());
    end_date = new Date($("#endDate").val());
    identity_to_row_index = new Map();
    for (let i in orders) {
        identity_to_row_index.set(orders[i].orderId + orders[i].customerName, i);
        orders[i].residual_quantity = orders[i].orderQuantity;
    }
    for (let i in schedule) {
        if (schedule[i].customerName == "最大生产数量") {
            let col_index = Math.ceil((schedule[i].date - start_date) / 3600 / 1000 / 24) //差8时区，向上取整
            residual_production_quantity[schedule[i].lineNumber][col_index] = schedule[i].productionQuantity;
            max_production[schedule[i].lineNumber][col_index] = schedule[i].productionQuantity;
        }
    }
    for (let i in schedule) {
        schedule[i].date = new Date(schedule[i].date)
        if (schedule[i].customerName != "最大生产数量") {
            let row_index = identity_to_row_index.get(schedule[i].orderId + schedule[i].customerName)
            let col_index = Math.ceil((schedule[i].date - start_date) / 3600 / 1000 / 24) //差8时区，向上取整
                // console.log("convertScheduleToProductionQuantity");
                // console.log(i);
                // console.log(schedule[i]);
                // console.log(schedule[i].lineNumber);
                // console.log(row_index);
                // console.log(col_index);
            production_quantity[schedule[i].lineNumber][row_index][col_index] = schedule[i].productionQuantity;
            residual_production_quantity[schedule[i].lineNumber][col_index] -= schedule[i].productionQuantity;
            orders[row_index].residual_quantity -= schedule[i].productionQuantity
        }
    }
    table_index = current_schedule_index;
    for (let table_index = 0; table_index < 2; table_index++) {
        for (let row_index in orders) {
            if (orders[row_index].residual_quantity <= 0) {
                continue;
            }
            if ((table_index == 0 && orders[row_index].plannedStartDate0 != null) || (table_index == 1 && orders[row_index].plannedStartDate1 != null)) {
                let col_index
                if (table_index == 0) {
                    col_index = Math.ceil((orders[row_index].plannedStartDate0 - start_date) / 3600 / 1000 / 24) //差8时区，向上取整
                } else if (table_index == 1) {
                    col_index = Math.ceil((orders[row_index].plannedStartDate1 - start_date) / 3600 / 1000 / 24) //差8时区，向上取整
                }
                for (let cur = col_index; cur < date_num; cur++) {
                    if (production_quantity[table_index][row_index][cur] == 0) {
                        if (orders[row_index].residual_quantity > residual_production_quantity[table_index][cur]) {
                            production_quantity[table_index][row_index][cur] = residual_production_quantity[table_index][cur];
                            orders[row_index].residual_quantity -= residual_production_quantity[table_index][cur];
                            residual_production_quantity[table_index][cur] = 0;
                        } else {
                            production_quantity[table_index][row_index][cur] = orders[row_index].residual_quantity
                            residual_production_quantity[table_index][cur] -= orders[row_index].residual_quantity;
                            orders[row_index].residual_quantity = 0;
                        }
                    }
                }
            }
        }
    }
}

// 打印生产数量安排表
function scheduleList(table_index) {
    start_date = new Date($("#startDate").val());
    end_date = new Date($("#endDate").val());
    date_num = Math.ceil((end_date - start_date) / 3600 / 1000 / 24) + 1;

    table = $("#scheduleList" + table_index + " table")
    let str = `<tbody><tr>\n`,
        col_idx = 0;
    for (let now = deepCopy(start_date); now <= end_date; now.setDate(now.getDate() + 1)) {
        let month = now.getMonth();
        let date = now.getDate();
        let day = now.getDay();
        str += `<th>` + (month + 1) + `-` + date + `<br/>` + weekday[day] + `</th>`;
    }
    str += `</tr>`;
    for (let row = 0; row < order_num; row++) {
        str += `<tr>`;
        for (let col = 0; col < date_num; col++) {
            str += `<td row-index="` + row + `" col-index="` + col + `"  table-index="` + table_index + `">`;
            if (production_quantity[table_index][row][col] > 0) {
                str += production_quantity[table_index][row][col]
            }
            str += `</td>`
        }
        str += `</tr>`;
    }
    str += `<tr>`;
    for (let col = 0; col < date_num; col++) {
        str += `<td style = "height: 60px;" row-index="` + order_num + `" col-index="` + col + `"  table-index="` + table_index + `">` + max_production[table_index][col] + `</td>`
    }
    str += `</tr>`;
    str += `<tr>`;
    for (let col = 0; col < date_num; col++) {
        if (residual_production_quantity[table_index][col] >= 0) {
            str += `<td style = "height: 60px;">` + residual_production_quantity[table_index][col] + `</td>`
        } else {
            str += `<td style = "height: 60px;" class = "errorCell">` + residual_production_quantity[table_index][col] + `</td>`
        }
    }
    str += `</tr>`;
    str += `</tbody>`;
    table.html(str);
}

function reloadTheSchedule() {
    let row_index, col_index, table_index, have_selected_cell = false;
    if ($(".selectedCell").length == 1) {
        row_index = parseInt($(".selectedCell").attr("row-index"));
        col_index = parseInt($(".selectedCell").attr("col-index"));
        table_index = parseInt($(".selectedCell").attr("table-index"));
        have_selected_cell = true;
    }
    initSchedule();
    convertScheduleToProductionQuantity();
    scheduleList(0);
    scheduleList(1);
    showBlenderOrder(orders);
    if (have_selected_cell) {
        if (table_index !== table_index) {
            $(`td[row-index='` + row_index + `'][col-index='` + col_index + `']:not([table-index])`).addClass("selectedCell");
        } else {
            $(`td[row-index='` + row_index + `'][col-index='` + col_index + `'][table-index='` + table_index + `']`).addClass("selectedCell");
        }
    }
}

function scheduleCellClick(table) {
    $(table).on("click", "tbody td", function(event) {
        if ($(this).attr("row-index") == undefined) {
            return;
        }
        if ($(".selectedCell").length == 1) {
            // 如果两次点击的是同一个块，则取消选中样式
            if ($(".selectedCell").is($(this))) {
                $(".selectedCell").removeClass("selectedCell");
            } else { // 如果两次点击的是不同的块
                $(".selectedCell").removeClass("selectedCell");
                $(this).addClass("selectedCell");
            }
        } else if ($(".selectedCell").length == 0) {
            $(this).addClass("selectedCell");
        }
    })
}

function showBlenderOrder(orders) {
    let str = "<tbody>"
    str += `<tr row-index="0">
                <th>单号</th>
                <th>客户名称</th>
                <th>计划开始日期</th>
                <th>计划结束日期</th>
                <th>订单数量</th>
                <th>产品型号</th>
                <th>剩余数量</th>
            </tr>`
    for (let order_idx in orders) {
        str += `<tr>
                    <td row-index="` + order_idx + `" col-index="0">` + (orders[order_idx].orderId == null ? "" : orders[order_idx].orderId) + `</td>
                    <td row-index="` + order_idx + `" col-index="1">` + (orders[order_idx].customerName == null ? "" : orders[order_idx].customerName) + `</td>`;

        if (current_schedule_index == 0) {
            str += `<td row-index="` + order_idx + `" col-index="2">` + (orders[order_idx].plannedStartDate0 == null ? "" : orders[order_idx].plannedStartDate0.getMonth() + 1 + "-" + orders[order_idx].plannedStartDate0.getDate()) + `</td>`;
        } else {
            str += `<td row-index="` + order_idx + `" col-index="2">` + (orders[order_idx].plannedStartDate1 == null ? "" : orders[order_idx].plannedStartDate1.getMonth() + 1 + "-" + orders[order_idx].plannedStartDate1.getDate()) + `</td>`;
        }

        str += `<td row-index="` + order_idx + `" col-index="3">` + (orders[order_idx].plannedEndDate == null ? "" : orders[order_idx].plannedEndDate.getMonth() + 1 + "-" + orders[order_idx].plannedEndDate.getDate()) + `</td>
                    <td row-index="` + order_idx + `" col-index="4">` + (orders[order_idx].orderQuantity == null ? "" : orders[order_idx].orderQuantity) + `</td>
                    <td row-index="` + order_idx + `" col-index="5">` + (orders[order_idx].productModel == null ? "" : orders[order_idx].productModel) + `</td>`;

        if (orders[order_idx].residual_quantity >= 0) {
            str += `<td row-index="` + order_idx + `" col-index="6">` + orders[order_idx].residual_quantity + `</td>`
        } else {
            str += `<td class = "errorCell" row-index="` + order_idx + `" col-index="6">` + orders[order_idx].residual_quantity + `</td>`
        }
        str += `</tr>`
    }
    str += `<tr>
                <th colspan = "7">最大生产数量</th>
            </tr>`
    str += `<tr>
                <th colspan = "7">剩余可安排生产数量</th>
            </tr>`
    str += "</tbody>"
    $("#order_list table").html(str)
}

// order_id    单号 orderId
// customer_name   客户名称 customerName
// planned_start_date0  流水线一计划开始日期 plannedStartDate0
// planned_start_date1  流水线二计划开始日期 plannedStartDate1
// planned_end_date    计划结束日期 plannedEndDate
// start_date  实际开始日期 startDate
// order_quantity  订单数量 orderQuantity
// product_model   产品型号 productModel
// merchandiser    跟单员   merchandiser
// comment 备注 comment
// file_number 所属文件 fileNumber


// 上下选择单元格
$(document).keydown(function(event) {
    if ($(".selectedCell").length != 0 && cell_move_flag == true) {
        event.stopPropagation();
        row_index = parseInt($(".selectedCell").attr("row-index"));
        col_index = parseInt($(".selectedCell").attr("col-index"));
        table_index = parseInt($(".selectedCell").attr("table-index"));
        console.log(table_index);
        if (table_index !== table_index) { //如果是订单表格
            let order_col_num = $("#order_list table tr:eq(0) th").length
            if (event.keyCode != 13) {
                switch (event.keyCode) {
                    case 37:
                        //37左
                        col_index = Math.max(0, col_index - 1);
                        break;
                    case 38:
                        // 38上
                        row_index = Math.max(0, row_index - 1);
                        event.preventDefault();
                        break;
                    case 39:
                        // 39右
                        col_index = Math.min(order_col_num - 1, col_index + 1);
                        break;
                    case 40:
                        // 40下
                        row_index = Math.min(order_num - 1, row_index + 1);
                        event.preventDefault();
                        break;
                }
                $(".selectedCell").removeClass("selectedCell");
                console.log(`td[row-index='` + row_index + `'][col-index='` + col_index + `']`);
                $(`td[row-index='` + row_index + `'][col-index='` + col_index + `']:not([table-index])`).addClass("selectedCell");
            } else {
                $("#orderInfo").text($(`#order_list table td[row-index=` + row_index + `][col-index=1]`).text() + ` ` + $(`#order_list table td[row-index=` + row_index + `][col-index=0]`).text());
                console.log(`#order_list table td[row-index=0][col-index=` + col_index + `]`);
                $("#labelName").text($(`#order_list table th[row-index=0][col-index=` + col_index + `]`).text())
                $("#productionQuantity").val("");
                $("#addPlanModal").modal("show");
            }
        } else { //如果是流水安排表格
            if (event.keyCode != 13) {
                switch (event.keyCode) {
                    case 37:
                        //37左
                        col_index = Math.max(0, col_index - 1);
                        break;
                    case 38:
                        // 38上
                        row_index = Math.max(0, row_index - 1);
                        event.preventDefault();
                        break;
                    case 39:
                        // 39右
                        col_index = Math.min(date_num - 1, col_index + 1);
                        break;
                    case 40:
                        // 40下
                        row_index = Math.min(order_num, row_index + 1);
                        event.preventDefault();
                        break;
                        // case 46:
                        //     // 46 del
                        //     $(`td[row-index='` + row_index + `'][col-index='` + col_index + `'][table-index='` + table_index + `']`).text("");
                        //     event.preventDefault();
                        //     break;
                }
                $(".selectedCell").removeClass("selectedCell");
                $(`td[row-index='` + row_index + `'][col-index='` + col_index + `'][table-index='` + table_index + `']`).addClass("selectedCell");
            } else {
                $("#orderInfo").text($(`#order_list table td[row-index=` + row_index + `][col-index=1]`).text() + ` ` + $(`#order_list table td[row-index=` + row_index + `][col-index=0]`).text());
                $("#productionQuantity").val("");
                $("#addPlanModal").modal("show");
            }
        }
    }
    console.log("document listen keydown : " + event.keyCode);
});

// 修改单元格模态框
$("#productionQuantity").keydown(function(event) {
    cell_move_flag = false;
    event.stopPropagation();
    row_index = parseInt($(".selectedCell").attr("row-index"));
    col_index = parseInt($(".selectedCell").attr("col-index"));
    table_index = parseInt($(".selectedCell").attr("table-index"));
    switch (event.keyCode) {
        case 13:
            modifyCell();
            $("#addPlanModal").modal("hide");
            cell_move_flag = true;
            break;
        case 27:
            $("#addPlanModal").modal("hide");
            cell_move_flag = true;
            break;
    }
})

$('#addPlanModal').on('shown.bs.modal', function() {
    $("#productionQuantity").focus();
})

$("#addPlanModalQuitButton").click(function() {
    cell_move_flag = true;
})

$("#addPlanModalConfirmButton").click(modifyCell())

function modifyCell() {
    let old_value = $(".selectedCell").text();
    let new_value = $("#productionQuantity").val();
    if (old_value != new_value) {
        let row_index = parseInt($(".selectedCell").attr("row-index"));
        let col_index = parseInt($(".selectedCell").attr("col-index"));
        let table_index = parseInt($(".selectedCell").attr("table-index"));
        // 如果修改了计划开始日期
        if (col_index == 2 && table_index !== table_index) {
            console.log("修改了计划开始日期");
            console.log(row_index);
            let pattern = /^([1-9]|0[1-9]|1[0-2])-([1-9]|0[1-9]|[12][0-9]|3[01])$/
            if (current_schedule_index == 0) {
                if (pattern.test(new_value) == false) {
                    orders[row_index].plannedStartDate0 = null;
                } else {
                    orders[row_index].plannedStartDate0 = new Date(new_value);
                    orders[row_index].plannedStartDate0.setFullYear(start_date.getFullYear());
                }
            }
            if (current_schedule_index == 1) {
                if (pattern.test(new_value) == false) {
                    orders[row_index].plannedStartDate1 = null;
                } else {
                    orders[row_index].plannedStartDate1 = new Date(new_value);
                    orders[row_index].plannedStartDate1.setFullYear(start_date.getFullYear());
                }
            }
            reloadTheSchedule();
        }
        // 如果修改了最大生产量
        else if (row_index == order_num) {
            console.log("修改了最大生产量");
            new_value = parseInt(new_value)
            if (new_value != new_value) {
                alert("请输入正确数字")
                return;
            }
            let exist = false;
            for (let i in schedule) {
                if (schedule[i].orderId == null &&
                    schedule[i].customerName == "最大生产数量" &&
                    schedule[i].fileNumber == $("#currentFile").text() &&
                    Math.ceil((schedule[i].date - start_date) / 3600 / 1000 / 24) == col_index &&
                    schedule[i].lineNumber == table_index) {
                    exist = true;
                    schedule[i].productionQuantity = new_value;
                    break;
                }

            }
            if (exist == false) {
                schedule.push({
                    "orderId": null,
                    "customerName": "最大生产数量",
                    "fileNumber": $("#currentFile").text(),
                    "date": new Date(start_date.getTime() + col_index * 24 * 3600 * 1e3),
                    "productionQuantity": new_value,
                    "lineNumber": table_index
                })
            }
            reloadTheSchedule();
        }
        // 修改了订单某日生产数量
        else if (table_index == table_index) {
            console.log("修改了订单某日生产数量");
            new_value = parseInt(new_value);
            if (new_value != new_value) {
                alert("请输入正确数字")
                return;
            }
            let exist = false;
            for (let i in schedule) {
                if (schedule[i].orderId == orders[row_index].orderId &&
                    schedule[i].customerName == orders[row_index].customerName &&
                    schedule[i].fileNumber == $("#currentFile").text() &&
                    Math.ceil((schedule[i].date - start_date) / 3600 / 1000 / 24) == col_index &&
                    schedule[i].lineNumber == table_index) {
                    exist = true;
                    schedule[i].productionQuantity = new_value;
                    break;
                }

            }
            if (exist == false) {
                schedule.push({
                    "orderId": orders[row_index].orderId,
                    "customerName": orders[row_index].customerName,
                    "fileNumber": $("#currentFile").text(),
                    "date": new Date(start_date.getTime() + col_index * 24 * 3600 * 1e3),
                    "productionQuantity": new_value,
                    "lineNumber": table_index
                })
            }
            reloadTheSchedule();
            return;
        }
        $(".selectedCell").text(new_value);
    }
    cell_move_flag = true;
}

// order_id    订单号
// customer_name   客户名称
// file_number 所属文件
// date    日期
// production_quantity 生产数量
// line_number 流水线序号