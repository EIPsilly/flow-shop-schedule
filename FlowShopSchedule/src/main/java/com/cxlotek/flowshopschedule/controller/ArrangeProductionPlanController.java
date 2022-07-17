package com.cxlotek.flowshopschedule.controller;

import com.alibaba.fastjson.JSON;
import com.cxlotek.flowshopschedule.PO.BlenderOrder;
import com.cxlotek.flowshopschedule.PO.Schedule;
import com.cxlotek.flowshopschedule.service.ArrangeProductionPlanService;
import jdk.swing.interop.SwingInterOpUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/ArrangeProductionPlan")
@Slf4j
public class ArrangeProductionPlanController {

    @Autowired
    public ArrangeProductionPlanService arrangeProductionPlanService;

    @RequestMapping("/getBlenderOrderByFileNumber")
    public Map<String,Object> getBlenderOrderByFileNumber(String fileNumber){
        log.info("getBlenderOrderByFileNumber()\tfileNumber:" + fileNumber);
        List<BlenderOrder> blenderOrders = arrangeProductionPlanService.selectBlenderOrderByFileNumber(fileNumber);
        List<Schedule> schedules = arrangeProductionPlanService.selectScheduleByFileNumber(fileNumber);
        Map<String, Object> hashMap = new HashMap<>();
        hashMap.put("blenderOrders",blenderOrders);
        hashMap.put("schedules",schedules);
        return hashMap;
    }


    @RequestMapping("/saveArrange")
    public String saveArrange(@RequestBody Map<String,Object> params){
        List<BlenderOrder> orders = JSON.parseArray(JSON.toJSONString(params.get("orders")), BlenderOrder.class);
        List<Schedule> schedule = JSON.parseArray(JSON.toJSONString(params.get("schedule")),Schedule.class);
        String fileNumber = (String)params.get("fileNumber");
        log.info("saveArrange()\tfileNumber:" + fileNumber);
        arrangeProductionPlanService.updateScheduleByFileNumber(orders,schedule,fileNumber);
        return "success";
    }

}