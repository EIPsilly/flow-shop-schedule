package com.cxlotek.flowshopschedule.controller;

import com.alibaba.excel.EasyExcel;
import com.cxlotek.flowshopschedule.PO.BlenderOrder;
import com.cxlotek.flowshopschedule.dao.BlenderOrderDao;
import com.cxlotek.flowshopschedule.utils.UploadBlenderOrderListener;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/ChooseFile")
@Slf4j
public class ChooseFileController {

    @Autowired
    private BlenderOrderDao blenderOrderDao;

    @RequestMapping("/uploadFile")
    private String uploadFile(@RequestPart MultipartFile file) throws IOException {
        blenderOrderDao.hashCode();
        String fileName = file.getOriginalFilename();
        EasyExcel.read(file.getInputStream(), BlenderOrder.class, new UploadBlenderOrderListener(blenderOrderDao, fileName)).sheet().doRead();
        log.info(fileName);
        return "Upload file success:" + fileName;
    }

}
