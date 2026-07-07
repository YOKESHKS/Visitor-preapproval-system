package com.visitor.management.controller;

import com.visitor.management.dto.DashboardDTO;
import com.visitor.management.response.ApiResponse;
import com.visitor.management.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DashboardController {

    private final DashboardService service;

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardDTO>> dashboard() {

        return ResponseEntity.ok(

                ApiResponse.<DashboardDTO>builder()

                        .success(true)

                        .message("Dashboard Loaded Successfully")

                        .data(service.getDashboard())

                        .build()

        );

    }

}