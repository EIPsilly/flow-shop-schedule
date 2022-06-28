package com.cxlotek.flowshopschedule;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.cxlotek.flowshopschedule.dao")
public class FlowShopScheduleApplication {

    public static void main(String[] args) {
        SpringApplication.run(FlowShopScheduleApplication.class, args);
    }

}
