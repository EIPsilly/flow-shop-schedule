package com.cxlotek.flowshopschedule.service;

import com.cxlotek.flowshopschedule.dao.BlenderOrderDao;
import com.cxlotek.flowshopschedule.dao.ScheduleDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChooseFileService {

    @Autowired
    private BlenderOrderDao blenderOrderDao;

    @Autowired
    private ScheduleDao scheduleDao;

    public List<String> getAllFileNumber() {
        return blenderOrderDao.selectAllFileNumber();
    }

    @Transactional
    public int deleteByFileNumber(String fileNumber){
        int tmp = scheduleDao.deleteByFileNumber(fileNumber);
        tmp += blenderOrderDao.deleteByFileNumber(fileNumber);
        return tmp;
    }

}
