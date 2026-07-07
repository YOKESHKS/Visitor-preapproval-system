package com.visitor.management.controller;

import com.visitor.management.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ExportController {

    private final ExportService service;

    @GetMapping("/excel")
    public ResponseEntity<byte[]> exportExcel() {

        byte[] file = service.exportVisitorsToExcel();

        return ResponseEntity.ok()

                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Visitors.xlsx")

                .contentType(MediaType.APPLICATION_OCTET_STREAM)

                .body(file);

    }

}