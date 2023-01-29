package com.cxlotek.flowshopschedule.controller;

import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.util.ListUtils;
import com.alibaba.excel.util.MapUtils;
import com.alibaba.excel.write.builder.ExcelWriterBuilder;
import com.alibaba.excel.write.builder.ExcelWriterSheetBuilder;
import com.alibaba.excel.write.metadata.WriteSheet;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.cxlotek.flowshopschedule.PO.BlenderOrder;
import com.cxlotek.flowshopschedule.PO.Schedule;
import com.cxlotek.flowshopschedule.service.ArrangeProductionPlanService;
import jdk.swing.interop.SwingInterOpUtils;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/ArrangeProductionPlan")
@Slf4j
public class ArrangeProductionPlanController {

    @Autowired
    public ArrangeProductionPlanService arrangeProductionPlanService;

    @RequestMapping("/getBlenderOrderByFileNumber")
    public Map<String, Object> getBlenderOrderByFileNumber(String fileNumber) {
        log.info("getBlenderOrderByFileNumber()\tfileNumber:" + fileNumber);
        List<BlenderOrder> blenderOrders = arrangeProductionPlanService.selectBlenderOrderByFileNumber(fileNumber);
        List<Schedule> schedules = arrangeProductionPlanService.selectScheduleByFileNumber(fileNumber);
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("blenderOrders", blenderOrders);
        hashMap.put("schedules", schedules);
        return hashMap;
    }


    @RequestMapping("/saveArrange")
    public String saveArrange(@RequestBody Map<String, Object> params) {
        List<BlenderOrder> orders = JSON.parseArray(JSON.toJSONString(params.get("orders")), BlenderOrder.class);
        List<Schedule> schedule = JSON.parseArray(JSON.toJSONString(params.get("schedule")), Schedule.class);
        String fileNumber = (String) params.get("fileNumber");
        log.info("saveArrange()\tfileNumber:" + fileNumber);
        log.info("orders.size() : " + orders.size() + "\tschedule.size() : " + schedule.size());
        arrangeProductionPlanService.updateScheduleByFileNumber(orders, schedule, fileNumber);
        return "success";
    }

    @RequestMapping("/exportExcel")
    public void exportExcelByFileNumber(HttpServletResponse response, @RequestBody Map<String, Object> params) throws IOException, ParseException {
        log.info("exportExcelByFileNumber()\tfileNumber:" + params.get("fileNumber"));
        System.out.println("fileNumber:\t" + params.get("fileNumber"));
        System.out.println("start_date:\t" + params.get("start_date"));
        System.out.println("end_date:\t" + params.get("end_date"));
        System.out.println("date_num:\t" + params.get("date_num"));
        System.out.println("order_num:\t" + params.get("order_num"));
        System.out.println("production_quantity:\t" + params.get("production_quantity"));
        JSONArray production_quantity = JSON.parseArray(JSON.toJSONString(params.get("production_quantity")));
        List<JSONArray> schedules = new ArrayList<>();
        for (int i = 0; i < production_quantity.size(); i++) {
            schedules.add(production_quantity.getJSONArray(i));
        }
        JSONArray orders = JSON.parseArray(JSON.toJSONString(params.get("orders")));
        System.out.println("orders:\t" + orders);
        System.out.println("production_quantity_type:\t" + params.get("production_quantity_type"));
        System.out.println("max_production_quantity:\t" + params.get("max_production_quantity"));
        System.out.println("residual_production_quantity:\t" + params.get("residual_production_quantity"));
        System.out.println("default_production_quantity:\t" + params.get("default_production_quantity"));

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        Calendar startCalendar = Calendar.getInstance();
        startCalendar.setTime(sdf.parse((String) params.get("start_date")));
        Calendar endCalendar = Calendar.getInstance();
        endCalendar.setTime(sdf.parse((String) params.get("end_date")));

        // 这里注意 有同学反应使用swagger 会导致各种问题，请直接用浏览器或者用postman
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setCharacterEncoding("utf-8");
        // 这里URLEncoder.encode可以防止中文乱码 当然和easyexcel没有关系
        String fileName = URLEncoder.encode("流水线", "UTF-8").replaceAll("\\+", "%20");
        response.setHeader("Content-disposition", "attachment;filename*=utf-8''" + fileName + ".xlsx");
        // 这里需要设置不关闭流
        ExcelWriter excelWriter = EasyExcel.write(response.getOutputStream()).autoCloseStream(false).build();
        for (int i = 0; i < schedules.size(); i++) {
            WriteSheet writeSheet = EasyExcel.writerSheet(i, "流水线" + i).head(head(startCalendar, endCalendar)).build();
//            EasyExcel.writerSheet().
            excelWriter.write(data(startCalendar, orders, schedules.get(i)), writeSheet);
        }
        excelWriter.close();
    }

    private List<List<Object>> data(Calendar startCalendar, JSONArray orders, JSONArray schedule) throws ParseException {
        List<List<Object>> list = ListUtils.newArrayList();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        SimpleDateFormat sdf2 = new SimpleDateFormat("MM-dd");
        for (int row = 0; row < orders.size(); row++) {
            List<Object> data = ListUtils.newArrayList();
            JSONObject orderObject = orders.getJSONObject(row);
            List<Integer> production_quantity = schedule.getJSONArray(row).toJavaList(Integer.class);

            data.add(orderObject.getString("customerName")); //  客户名称
            data.add(orderObject.getString("orderId"));  //  单号

            int NonZeroIndex = production_quantity.stream().filter(x -> x != 0).findFirst().orElse(-1);
            Calendar tmp = Calendar.getInstance();
            tmp.setTime(startCalendar.getTime());
            tmp.add(Calendar.DATE, NonZeroIndex);
            data.add(sdf2.format(tmp.getTime()));   //  计划开始日期

            data.add(sdf2.format(sdf.parse(orderObject.getString("plannedEndDate"))));   //  计划结束日期
            data.add(orderObject.getString("orderQuantity"));    //  订单数量
            data.add(orderObject.getString("productModel")); //  产品型号
            data.add(orderObject.getString("residual_quantity"));    //  剩余数量

            for (Integer item : production_quantity) {
                if (item == 0) {
                    data.add("");
                } else {
                    data.add(item);
                }
            }
            list.add(data);
        }
        return list;
    }

    private List<List<String>> head(Calendar startCalendar, Calendar endCalendar) {
        List<List<String>> list = new ArrayList<List<String>>();
        list.add(new ArrayList<String>(Arrays.asList("客户名称")));
        list.add(new ArrayList<String>(Arrays.asList("单号")));
        list.add(new ArrayList<String>(Arrays.asList("计划开始日期")));
        list.add(new ArrayList<String>(Arrays.asList("计划结束日期")));
        list.add(new ArrayList<String>(Arrays.asList("订单数量")));
        list.add(new ArrayList<String>(Arrays.asList("产品型号")));
        list.add(new ArrayList<String>(Arrays.asList("剩余数量")));


        Calendar tmp = Calendar.getInstance();
        tmp.setTime(startCalendar.getTime());

        Calendar tmp2 = Calendar.getInstance();
        tmp2.setTime(endCalendar.getTime());
        tmp2.add(Calendar.DATE, 1);

        while (tmp.before(tmp2)) {
            list.add(new ArrayList<String>(Arrays.asList(new SimpleDateFormat("MM-dd").format(tmp.getTime()))));
            tmp.add(Calendar.DATE, 1);
        }

        return list;
    }
}