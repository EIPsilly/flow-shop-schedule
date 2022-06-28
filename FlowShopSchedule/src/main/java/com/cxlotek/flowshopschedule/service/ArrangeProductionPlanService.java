package com.cxlotek.flowshopschedule.service;

import com.cxlotek.flowshopschedule.PO.BlenderOrder;
import com.cxlotek.flowshopschedule.dao.BlenderOrderDao;
import com.cxlotek.flowshopschedule.dao.SchuduleDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArrangeProductionPlanService {

    @Autowired
    private BlenderOrderDao blenderOrderDao;

    @Autowired
    private SchuduleDao schuduleDao;

    private List<BlenderOrder> SelectByFileNumber(String FileNumber){
        return blenderOrderDao.SelectByFileNumber(FileNumber);
    }
}
