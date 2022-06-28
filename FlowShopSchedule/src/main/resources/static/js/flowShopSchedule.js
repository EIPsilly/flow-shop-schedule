var weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
var month = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]

var start_date = new Date(2022, 5, 1);
var end_date = new Date(2022, 5, 30);

function temp(container) {
    const width = $(container).innerWidth();
    const height = $(container).innerHeight();

    let svg = d3.select(container).append("svg")
        .attr("id", "dependencyParsingSVG")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "background-color: #F9FCFF");

    const cx = d => d.day * width / 7;
}

// temp("#scheduleSvgLeft")
// temp("#scheduleSvgRight")