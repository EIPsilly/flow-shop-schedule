package com.cxlotek.flowshopschedule.service;

import com.cxlotek.flowshopschedule.dao.BlenderOrderDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChooseFileService {

    @Autowired
    private BlenderOrderDao blenderOrderDao;

    public List<String> getAllFileNumber() {
        return blenderOrderDao.selectAllFileNumber();
    }

    public int deleteByFileNumber(String fileNumber){
        return blenderOrderDao.deleteByFileNumber(fileNumber);
    }

}
