package com.cxlotek.flowshopschedule.dao;

import com.cxlotek.flowshopschedule.PO.BlenderOrder;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface BlenderOrderDao {
    int insert(BlenderOrder record);

    int insertSelective(BlenderOrder record);

    @Select("Select * from blender_order Where file_number = #{FileNumber}")
    List<BlenderOrder> selectByFileNumber(String FileNumber);

    int insertBatch(List<BlenderOrder> blenderOrderList);

    @Select("Select distinct file_number from blender_order")
    List<String> selectAllFileNumber();

    @Delete("delete FROM blender_order Where file_number = #{FileNumber}")
    int deleteByFileNumber(String FileNumber);
}