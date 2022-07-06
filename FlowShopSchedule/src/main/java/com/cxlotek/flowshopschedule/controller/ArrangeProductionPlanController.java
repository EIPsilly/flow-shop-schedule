package com.cxlotek.flowshopschedule.controller;

import com.cxlotek.flowshopschedule.PO.BlenderOrder;
import com.cxlotek.flowshopschedule.PO.Schedule;
import com.cxlotek.flowshopschedule.service.ArrangeProductionPlanService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

}