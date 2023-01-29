package com.cxlotek.flowshopschedule;

import com.cxlotek.flowshopschedule.PO.BlenderOrder;
import com.cxlotek.flowshopschedule.PO.Schedule;
import com.cxlotek.flowshopschedule.service.ArrangeProductionPlanService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.UUID;

@SpringBootTest
class FlowShopScheduleApplicationTests {

    @Autowired
    public ArrangeProductionPlanService arrangeProductionPlanService;

    @Test
    void contextLoads() {
        for (int i = 0; i < 10; i++) {
            String uuid = UUID.randomUUID().toString().replaceAll("-", "");
            System.out.println(uuid);
        }
    }

    @Test
    void exportExcel(){
        String fileNumber = "2022-12.xlsx";
        List<BlenderOrder> blenderOrders = arrangeProductionPlanService.selectBlenderOrderByFileNumber(fileNumber);
        List<Schedule> schedules = arrangeProductionPlanService.selectScheduleByFileNumber(fileNumber);
        System.out.println(blenderOrders);
        System.out.println(schedules);
    }

}
