package com.visitor.management.service.impl;

import com.visitor.management.entity.Visitor;
import com.visitor.management.repository.VisitorRepository;
import com.visitor.management.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportServiceImpl implements ExportService {

    private final VisitorRepository repository;

    @Override
    public byte[] exportVisitorsToExcel() {

        try {

            List<Visitor> visitors = repository.findAll();

            XSSFWorkbook workbook = new XSSFWorkbook();

            XSSFSheet sheet = workbook.createSheet("Visitors");

            Row header = sheet.createRow(0);

            header.createCell(0).setCellValue("Visit ID");
            header.createCell(1).setCellValue("Visitor");
            header.createCell(2).setCellValue("Company");
            header.createCell(3).setCellValue("Government ID");
            header.createCell(4).setCellValue("Mobile");
            header.createCell(5).setCellValue("Visit Date");
            header.createCell(6).setCellValue("Status");

            int row = 1;

            for (Visitor visitor : visitors) {

                Row data = sheet.createRow(row++);

                data.createCell(0).setCellValue(visitor.getVisitId());
                data.createCell(1).setCellValue(visitor.getVisitorName());
                data.createCell(2).setCellValue(visitor.getCompanyName());
                data.createCell(3).setCellValue(visitor.getGovernmentId());
                data.createCell(4).setCellValue(visitor.getMobileNumber());
                data.createCell(5).setCellValue(visitor.getVisitDate().toString());
                data.createCell(6).setCellValue(visitor.getStatus().name());

            }

            ByteArrayOutputStream output = new ByteArrayOutputStream();

            workbook.write(output);

            workbook.close();

            return output.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

}