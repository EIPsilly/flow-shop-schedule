var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
var month = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]

var start_date = new Date(2022, 5, 1);
var end_date = new Date(2022, 5, 30);

function scheduleList() {
    let str = `<tbody><tr>\n`;
    for (let now = start_date; now <= end_date; now.setDate(now.getDate() + 1)) {
        month = now.getMonth();
        date = now.getDate();
        day = now.getDay();
        str += `<th>` + (month + 1) + `/` + date + `<br/>` + weekday[day] + `</th>\n`;
    }
    str += `</tr></tbody>`;
    $("#scheduleList table").html(str);

    $("#scheduleList table tbody");
}

$("#scheduleList table td").click(function(event) {
    console.log(this);
    console.log($(this).attr("date-index"));
    console.log($(this).attr("order-index"));
    console.log(event);
})

scheduleList()

function order_list(orders) {
    orders

    order_id
    customer_name
    start_date
    planned_date
    order_quantity
    product_model
    comment
}

order_list()