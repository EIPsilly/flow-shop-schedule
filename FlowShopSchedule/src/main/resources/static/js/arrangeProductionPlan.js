// 标签页切换
$("#arrangeProductionButton").click(function() {
    if ($("#currentFile").text() == "尚未选择") {
        alert("请选择文件");
    } else {
        getOrderByFileName();
    }
})

var orders, //订单列表
    schedule, //生产安排
    identity_to_row_index, //根据单号和客户名称获得其在订单列表中的位置
    current_schedule_index = 0; //当前流水线

var weekday = ["日", "一", "二", "三", "四", "五", "六"];
var month = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
var days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var date_patt = /^[0-9]{4}-([1-9]|0[1-9]|1[0-2])-([1-9]|0[1-9]|[12][0-9]|3[01])$/; //日期格式
var start_date = new Date(2022, 5, 1);
var end_date = new Date(2022, 5, 20);
var date_num = 0; //日期数量
var order_num = 0; //订单数量
var cell_move_flag = true; //控制单元格是否移动
var production_quantity = new Array();
var production_quantity_type = new Array();
var max_production_quantity = new Array();
var residual_production_quantity = new Array();
var default_production_quantity = new Array();

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

// 生成流水表
$("#createScheduleListTable").click(function() {
    reloadTheSchedule();
});

// 切换流水表
$("#switchSchedule").click(function() {
    $(".scheduleList").toggle();
    current_schedule_index = 1 - current_schedule_index;
    reloadTheSchedule();
})

// 保存流水表
$("#saveArrange").click(function() {
    saveArrange();
})

// 初始化生产数量安排表、最大数量表、剩余数量表
function initSchedule() {
    orders.sort(function(a, b) {
        if (current_schedule_index == 0) {
            return a.plannedStartDate0 - b.plannedStartDate0;
        } else if (current_schedule_index == 1) {
            return a.plannedStartDate1 - b.plannedStartDate1;
        }
    })
    order_num = orders.length;
    start_date = new Date($("#startDate").val());
    end_date = new Date($("#endDate").val());
    date_num = Math.ceil((end_date - start_date) / 3600 / 1000 / 24) + 1;

    default_production_quantity = [2000, 2000];
    for (let i = 0; i < schedule.length; i++) {
        if (schedule[i].customerName == "默认最大生产数量") {
            default_production_quantity[schedule[i].lineNumber] = schedule[i].productionQuantity;
        }
    }

    for (let table_index = 0; table_index < $(".scheduleList").length; table_index++) {
        production_quantity[table_index] = new Array();
        production_quantity_type[table_index] = new Array();
        for (let row = 0; row < order_num; row++) {
            production_quantity[table_index][row] = new Array();
            production_quantity_type[table_index][row] = new Array();
            for (let col = 0; col < date_num; col++) {
                production_quantity[table_index][row][col] = 0;
                let day = new Date((start_date.getTime() + col * 24 * 3600 * 1e3)).getDay();
                if (day == 0) {
                    production_quantity_type[table_index][row][col] = "sundayCell";
                } else if (day == 6) {
                    production_quantity_type[table_index][row][col] = "saturdayCell";
                } else {
                    production_quantity_type[table_index][row][col] = "";
                }
            }
        }
        max_production_quantity[table_index] = new Array();
        residual_production_quantity[table_index] = new Array();
        for (let col = 0; col < date_num; col++) {
            max_production_quantity[table_index][col] = default_production_quantity[table_index];
            residual_production_quantity[table_index][col] = default_production_quantity[table_index];
        }
    }
}


// 将生产订单转换成生产数量表
function convertScheduleToProductionQuantity() {
    start_date = new Date($("#startDate").val());
    end_date = new Date($("#endDate").val());
    identity_to_row_index = new Map();
    for (let i in orders) {
        identity_to_row_index.set(orders[i].orderId + orders[i].customerName + orders[i].productModel, i);
        orders[i].residual_quantity = orders[i].orderQuantity;
    }
    for (let i = 0; i < schedule.length; i++) {
        if (schedule[i].productionQuantity == 0) {
            console.log(schedule[i])
            schedule.splice(i, 1);
            i--;
        } else if (schedule[i].customerName == "最大生产数量") {
            let col_index = Math.ceil((schedule[i].date - start_date) / 3600 / 1000 / 24) //差8时区，向上取整
            residual_production_quantity[schedule[i].lineNumber][col_index] = schedule[i].productionQuantity;
            max_production_quantity[schedule[i].lineNumber][col_index] = schedule[i].productionQuantity;
        }
    }
    for (let i in schedule) {
        schedule[i].date = new Date(schedule[i].date)
        if ((schedule[i].customerName != "最大生产数量") && (schedule[i].customerName != "默认最大生产数量")) {
            let row_index = identity_to_row_index.get(schedule[i].orderId + schedule[i].customerName + schedule[i].productModel)
            let col_index = Math.ceil((schedule[i].date - start_date) / 3600 / 1000 / 24) //差8时区，向上取整
            console.log("convertScheduleToProductionQuantity");
            console.log("i : ", i);
            console.log("schedule[i] : ", schedule[i]);
            console.log("row_index : ", row_index);
            console.log("col_index : ", col_index);
            production_quantity[schedule[i].lineNumber][row_index][col_index] = schedule[i].productionQuantity;
            production_quantity_type[schedule[i].lineNumber][row_index][col_index] = "manualCell";
            if (schedule[i].productionQuantity != -1) {
                residual_production_quantity[schedule[i].lineNumber][col_index] -= schedule[i].productionQuantity;
                orders[row_index].residual_quantity -= schedule[i].productionQuantity
            }
        }
    }
    for (let row_index in orders) {
        if (orders[row_index].residual_quantity <= 0) {
            continue;
        }
        if (orders[row_index].plannedStartDate0 != null && orders[row_index].plannedStartDate1 == null) {
            let col_index = Math.ceil((orders[row_index].plannedStartDate0 - start_date) / 3600 / 1000 / 24) //差8时区，向上取整
            orders[row_index].residual_quantity = automaticallyAllocate(0, row_index, col_index, orders[row_index].residual_quantity);
        } else if (orders[row_index].plannedStartDate0 == null && orders[row_index].plannedStartDate1 != null) {
            let col_index = Math.ceil((orders[row_index].plannedStartDate1 - start_date) / 3600 / 1000 / 24) //差8时区，向上取整
            orders[row_index].residual_quantity = automaticallyAllocate(1, row_index, col_index, orders[row_index].residual_quantity);
        } else if (orders[row_index].plannedStartDate0 != null && orders[row_index].plannedStartDate1 != null) {
            let col_index0 = Math.ceil((orders[row_index].plannedStartDate0 - start_date) / 3600 / 1000 / 24) //差8时区，向上取整
            let col_index1 = Math.ceil((orders[row_index].plannedStartDate1 - start_date) / 3600 / 1000 / 24) //差8时区，向上取整
            let quantity0 = Math.floor(orders[row_index].residual_quantity / 2);
            let quantity1 = orders[row_index].residual_quantity - quantity0;
            orders[row_index].residual_quantity = automaticallyAllocate(0, row_index, col_index0, quantity0) + automaticallyAllocate(1, row_index, col_index1, quantity1);
        }
    }
}

// 自动安排订单
function automaticallyAllocate(table_index, row_index, col_index, quantity) {
    for (let cur = col_index; cur < date_num; cur++) {
        if (production_quantity[table_index][row_index][cur] == 0 && residual_production_quantity[table_index][cur] > 0) {
            if (quantity > residual_production_quantity[table_index][cur]) {
                production_quantity[table_index][row_index][cur] = residual_production_quantity[table_index][cur];
                quantity -= residual_production_quantity[table_index][cur];
                residual_production_quantity[table_index][cur] = 0;
            } else {
                production_quantity[table_index][row_index][cur] = quantity
                residual_production_quantity[table_index][cur] -= quantity;
                quantity = 0;
            }
        }
    }
    return quantity;
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
        str += `<tr row-index="` + row + `" table-index="` + table_index + `">`;
        for (let col = 0; col < date_num; col++) {
            str += `<td class="` + production_quantity_type[table_index][row][col] + `" row-index="` + row + `" col-index="` + col + `"  table-index="` + table_index + `">`;
            if (production_quantity[table_index][row][col] > 0) {
                str += production_quantity[table_index][row][col]
            }
            str += `</td>`
        }
        str += `</tr>`;
    }
    str += `<tr row-index="` + order_num + `">`;
    for (let col = 0; col < date_num; col++) {
        str += `<td style = "height: 60px;" row-index="` + order_num + `" col-index="` + col + `"  table-index="` + table_index + `">` + max_production_quantity[table_index][col] + `</td>`
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

// 打印所有订单
function showBlenderOrder(orders) {
    let str = "<tbody>"
    str += `<tr>
                <th>客户名称</th>
                <th>单号</th>
                <th>计划开始日期</th>
                <th>计划结束日期</th>
                <th>订单数量</th>
                <th>产品型号</th>
                <th>剩余数量</th>
            </tr>`
    for (let order_idx in orders) {
        str += `<tr row-index="` + order_idx + `">
                    <td row-index="` + order_idx + `" col-index="0">` + (orders[order_idx].customerName == null ? "" : orders[order_idx].customerName) + `</td>
                    <td row-index="` + order_idx + `" col-index="1">` + (orders[order_idx].orderId == null ? "" : orders[order_idx].orderId) + `</td>`;

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
    str += `<tr row-index="` + order_num + `">
                <th colspan = "7">默认最大生产数量：<input type = "text" id = "defaultProductionQuantity" value = "` + default_production_quantity[current_schedule_index] + `"></th>
            </tr>`
    str += `<tr>
                <th colspan = "7">剩余可安排生产数量</th>
            </tr>`
    str += "</tbody>"
    $("#order_list table").html(str)
}

// customer_name   客户名称 customerName
// order_id    单号 orderId
// planned_start_date0  流水线一计划开始日期 plannedStartDate0
// planned_start_date1  流水线二计划开始日期 plannedStartDate1
// planned_end_date    计划结束日期 plannedEndDate
// start_date  实际开始日期 startDate
// order_quantity  订单数量 orderQuantity
// product_model   产品型号 productModel
// merchandiser    跟单员   merchandiser
// comment 备注 comment
// file_number 所属文件 fileNumber


function addTableEvent() {
    // 修改默认最大生产数量
    $("#defaultProductionQuantity").keydown(function(event) {
        event.stopPropagation();
        console.log("defaultProductionQuantity.keydown");
        if (event.keyCode == 13) {
            default_production_quantity[current_schedule_index] = parseInt($("#defaultProductionQuantity").val());
            let exist = false;
            for (let i in schedule) {
                if (schedule[i].customerName == "默认最大生产数量" &&
                    schedule[i].fileNumber == $("#currentFile").text() &&
                    schedule[i].lineNumber == current_schedule_index) {
                    exist = true;
                    schedule[i].productionQuantity = default_production_quantity[current_schedule_index];
                    break;
                }
            }
            if (exist == false) {
                schedule.push({
                    "orderId": null,
                    "customerName": "默认最大生产数量",
                    "fileNumber": $("#currentFile").text(),
                    "date": null,
                    "productionQuantity": default_production_quantity[current_schedule_index],
                    "lineNumber": current_schedule_index,
                    "productModel": null
                })

            }
            reloadTheSchedule();
        }
    })
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
    addTableEvent();
    if (have_selected_cell) {
        if (table_index !== table_index) {
            $(`td[row-index='` + row_index + `'][col-index='` + col_index + `']:not([table-index])`).addClass("selectedCell");
        } else {
            $(`td[row-index='` + row_index + `'][col-index='` + col_index + `'][table-index='` + table_index + `']`).addClass("selectedCell");
        }
    }
}

// 上下选择单元格
$(document).keydown(function(event) {
    console.log("td keydown");
    if ($(".selectedCell").length != 0 && cell_move_flag == true) {
        // event.stopPropagation();
        let row_index = parseInt($(".selectedCell").attr("row-index"));
        let col_index = parseInt($(".selectedCell").attr("col-index"));
        let table_index = parseInt($(".selectedCell").attr("table-index"));
        let order_col_num = $("#order_list table tr:eq(0) th").length
        if (table_index !== table_index) { //如果是订单表格
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
                        // if (col_index + 1 == order_col_num) { //如果在订单表格的最右边，则跳转到流水安排表格
                        //     $(".selectedCell").removeClass("selectedCell");
                        //     $(`td[row-index='` + row_index + `'][col-index='0'][table-index='` + current_schedule_index + `']`).addClass("selectedCell");
                        //     return;
                        // } else col_index++;
                        break;
                    case 40:
                        // 40下
                        row_index = Math.min(order_num - 1, row_index + 1);
                        event.preventDefault();
                        break;
                }
                $(".selectedCell").removeClass("selectedCell");
                // console.log(`td[row-index='` + row_index + `'][col-index='` + col_index + `']`);
                $(`td[row-index='` + row_index + `'][col-index='` + col_index + `']:not([table-index])`).addClass("selectedCell");
                $(".selectedRow").removeClass("selectedRow");
                $(`tr[row-index='` + row_index + `']`).addClass("selectedRow");
            } else {
                $("#orderInfo").text($(`#order_list table td[row-index=` + row_index + `][col-index=1]`).text() + ` ` + $(`#order_list table td[row-index=` + row_index + `][col-index=0]`).text());
                // console.log(`#order_list table td[row-index=0][col-index=` + col_index + `]`);
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
                        // if (col_index - 1 < 0) {
                        //     $(".selectedCell").removeClass("selectedCell");
                        //     $(`td[row-index='` + row_index + `'][col-index='` + (order_col_num - 1) + `']:not([table-index])`).addClass("selectedCell");
                        //     return;
                        // } else col_index--;
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
                $(".selectedRow").removeClass("selectedRow");
                $(`tr[row-index='` + row_index + `']`).addClass("selectedRow");
            } else {
                $("#orderInfo").text($(`#order_list table td[row-index=` + row_index + `][col-index=1]`).text() + ` ` + $(`#order_list table td[row-index=` + row_index + `][col-index=0]`).text());
                $("#productionQuantity").val("");
                $("#addPlanModal").modal("show");
            }
        }
    }
    if (event.altKey && event.keyCode == 49) {
        event.stopPropagation();
        $(".scheduleList").hide();
        $(".scheduleList:eq(0)").show();
        current_schedule_index = 0;
        reloadTheSchedule();
    } else if (event.altKey && event.keyCode == 50) {
        event.stopPropagation();
        $(".scheduleList").hide();
        $(".scheduleList:eq(1)").show();
        current_schedule_index = 1;
        reloadTheSchedule();
    }
    console.log("document listen keydown : " + event.keyCode);
});

//  单元格点击事件
function scheduleCellClick(table) {
    $(table).on("click", "tbody td", function(event) {
        event.stopPropagation();
        if ($(this).attr("row-index") == undefined) {
            return;
        }
        console.log("点击td");
        $("#orderContextMenu").hide();
        if ($(".selectedCell").length == 1) {
            // 如果两次点击的是同一个块，则取消选中样式
            if ($(".selectedCell").is($(this))) {
                $(".selectedCell").removeClass("selectedCell");
                $(".selectedRow").removeClass("selectedRow");
            } else { // 如果两次点击的是不同的块
                $(".selectedCell").removeClass("selectedCell");
                $(this).addClass("selectedCell");
                $(".selectedRow").removeClass("selectedRow");
                $(`tr[row-index='` + $(this).attr("row-index") + `']`).addClass("selectedRow");
            }
        } else if ($(".selectedCell").length == 0) {
            $(this).addClass("selectedCell");
            $(`tr[row-index='` + $(this).attr("row-index") + `']`).addClass("selectedRow");
        }
    })
}
scheduleCellClick("#order_list");
scheduleCellClick("#scheduleList0");
scheduleCellClick("#scheduleList1");

$(document).click(function() {
    console.log("点击document");
    $("#orderContextMenu").hide();
    $(".selectedCell").removeClass("selectedCell");
})

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

$("#addPlanModalConfirmButton").click(function() {
    modifyCell();
    $("#addPlanModal").modal("hide");
    cell_move_flag = true;
})

function modifyCell() {
    let old_value = $(".selectedCell").text();
    let new_value = $("#productionQuantity").val();
    let row_index = parseInt($(".selectedCell").attr("row-index"));
    let col_index = parseInt($(".selectedCell").attr("col-index"));
    let table_index = parseInt($(".selectedCell").attr("table-index"));
    if (table_index !== table_index) { //修改订单信息
        if (col_index == 2) { // 如果修改了计划开始日期
            console.log("修改了计划开始日期");
            console.log(row_index);
            let pattern = /^([1-9]|0[1-9]|1[0-2])-([1-9]|0[1-9]|[12][0-9]|3[01])$/
            console.log(pattern.test(new_value));
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
        } else if (col_index != 6) { //修改剩余数量则无效
            switch (col_index) {
                case 0:
                    orders[row_index].customerName = new_value;
                    break;
                case 1:
                    orders[row_index].orderId = new_value;
                    break;
                case 3:
                    orders[row_index].plannedEndDate = new Date(new_value);
                    orders[row_index].plannedEndDate.setFullYear(start_date.getFullYear());
                    break;
                case 4:
                    orders[row_index].orderQuantity = parseInt(new_value);
                    break;
                case 5:
                    orders[row_index].productModel = new_value;
                    break;
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
                "lineNumber": table_index,
                "productModel": null
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
                schedule[i].productModel == orders[row_index].productModel &&
                schedule[i].fileNumber == $("#currentFile").text() &&
                Math.ceil((schedule[i].date - start_date) / 3600 / 1000 / 24) == col_index &&
                schedule[i].lineNumber == table_index) {
                exist = true;
                schedule[i].productionQuantity = new_value;
                break;
            }
        }
        if (exist == false && new_value != 0) {
            schedule.push({
                "orderId": orders[row_index].orderId,
                "customerName": orders[row_index].customerName,
                "fileNumber": $("#currentFile").text(),
                "date": new Date(start_date.getTime() + col_index * 24 * 3600 * 1e3),
                "productionQuantity": new_value,
                "lineNumber": table_index,
                "productModel": orders[row_index].productModel
            })
        }
        reloadTheSchedule();
        return;
    }
    cell_move_flag = true;
}

// order_id    订单号
// customer_name   客户名称
// file_number 所属文件
// date    日期
// production_quantity 生产数量
// line_number 流水线序号
// product_model   产品型号 productModel

// 删除订单
$("#order_list").on("contextmenu", "table td", function() {
    return false;
})

$("#order_list").on("mousedown", "table td", function(event) {
    event.stopPropagation();
    console.log("event.which = ", event.which);
    $("#orderContextMenu").hide();
    if (event.which == 3 && $(this)[0] == $(".selectedCell")[0]) {
        $("#orderContextMenu").show();
        let x = event.clientX;
        let y = event.clientY;
        $("#orderContextMenu").css("top", y);
        $("#orderContextMenu").css("left", x);
        console.log("x=", x, "y=", y);
    }
})

$("#orderContextMenu").on("click", "li", function(event) {
    event.stopPropagation();
    console.log("点击右键菜单选项");
    $("#orderContextMenu").hide();
    if ($(this).text() == "删除") {
        let idx = $(".selectedCell").attr("row-index")
        orders.splice(idx, 1);
        reloadTheSchedule();
    }
})

// 添加订单
$("#addOrder").click(function() {
    orders.push({
        "orderId": null,
        "customerName": null,
        "plannedStartDate0": null,
        "plannedStartDate1": null,
        "plannedEndDate": null,
        "startDate": null,
        "orderQuantity": null,
        "productModel": null,
        "merchandiser": null,
        "comment": null,
        "fileNumber": $("#currentFile").text()
    });
    reloadTheSchedule();
})