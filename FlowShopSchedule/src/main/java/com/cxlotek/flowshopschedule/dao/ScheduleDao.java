package com.cxlotek.flowshopschedule.dao;

import com.cxlotek.flowshopschedule.PO.Schedule;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface ScheduleDao {
    int insert(Schedule record);

    int insertSelective(Schedule record);

    @Select("Select * from schedule Where file_number = #{fileNumber}")
    List<Schedule> selectByFileNumber(String fileNumber);
}