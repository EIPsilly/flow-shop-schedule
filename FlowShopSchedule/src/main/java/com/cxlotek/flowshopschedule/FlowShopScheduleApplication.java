package com.cxlotek.flowshopschedule;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@MapperScan("com.cxlotek.flowshopschedule.dao")
@EnableTransactionManagement
public class FlowShopScheduleApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlowShopScheduleApplication.class, args);
    }

    //    nohup java -jar FlowShopSchedule-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod > applog.log 2>&1 &
}
