package com.cxlotek.flowshopschedule.controller;

import com.alibaba.excel.EasyExcel;
import com.cxlotek.flowshopschedule.PO.BlenderOrder;
import com.cxlotek.flowshopschedule.dao.BlenderOrderDao;
import com.cxlotek.flowshopschedule.service.ChooseFileService;
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
import java.util.List;

@RestController
@RequestMapping("/ChooseFile")
@Slf4j
public class ChooseFileController {

    @Autowired
    private BlenderOrderDao blenderOrderDao;

    @Autowired
    private ChooseFileService chooseFileService;

    @RequestMapping("/uploadFile")
    public String uploadFile(@RequestPart MultipartFile file) throws IOException {
        blenderOrderDao.hashCode();
        String fileNumber = file.getOriginalFilename();
        EasyExcel.read(file.getInputStream(), BlenderOrder.class, new UploadBlenderOrderListener(blenderOrderDao, fileNumber)).sheet().doRead();
        log.info(fileNumber);
        return "Upload file success:" + fileNumber;
    }

    @RequestMapping("/getFileList")
    public List<String> getFileList(){
        return chooseFileService.getAllFileNumber();
    }

    @RequestMapping("/deleteFile")
    public int deleteOrderByFileNumber(String fileNumber){
        log.info("fileNumber：" + fileNumber);
//        return 1;
        return chooseFileService.deleteByFileNumber(fileNumber);
    }
}
