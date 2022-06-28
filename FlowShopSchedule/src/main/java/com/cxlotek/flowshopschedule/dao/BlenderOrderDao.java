package com.cxlotek.flowshopschedule.dao;

import com.cxlotek.flowshopschedule.PO.BlenderOrder;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface BlenderOrderDao {
    int insert(BlenderOrder record);

    int insertSelective(BlenderOrder record);

    @Select("Select * from blender_order Where file_number = #{FileNumber}")
    List<BlenderOrder> SelectByFileNumber(String FileNumber);

    int insertBatch(List<BlenderOrder> blenderOrderList);
}