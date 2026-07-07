package com.visitor.management.controller;

import com.visitor.management.dto.ReportDTO;
import com.visitor.management.response.ApiResponse;
import com.visitor.management.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReportController {

    private final ReportService service;

    @GetMapping
    public ResponseEntity<ApiResponse<ReportDTO>> report() {

        return ResponseEntity.ok(

                ApiResponse.<ReportDTO>builder()

                        .success(true)

                        .message("Report Generated Successfully")

                        .data(service.generateReport())

                        .build()

        );

    }

}