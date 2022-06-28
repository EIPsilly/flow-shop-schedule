package com.cxlotek.flowshopschedule.dao;

import com.cxlotek.flowshopschedule.PO.Schudule;

public interface SchuduleDao {
    int insert(Schudule record);

    int insertSelective(Schudule record);
}