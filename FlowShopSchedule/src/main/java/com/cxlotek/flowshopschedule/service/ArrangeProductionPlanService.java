package com.cxlotek.flowshopschedule.service;

import com.cxlotek.flowshopschedule.PO.BlenderOrder;
import com.cxlotek.flowshopschedule.PO.Schedule;
import com.cxlotek.flowshopschedule.dao.BlenderOrderDao;
import com.cxlotek.flowshopschedule.dao.ScheduleDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArrangeProductionPlanService {

    @Autowired
    private BlenderOrderDao blenderOrderDao;

    @Autowired
    private ScheduleDao schuduleDao;

    public List<BlenderOrder> selectBlenderOrderByFileNumber(String FileNumber){
        return blenderOrderDao.selectByFileNumber(FileNumber);
    }

    public List<Schedule> selectScheduleByFileNumber(String FileNumber){
        return schuduleDao.selectByFileNumber(FileNumber);
    }
}
