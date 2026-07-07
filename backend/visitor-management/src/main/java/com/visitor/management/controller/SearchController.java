package com.visitor.management.controller;

import com.visitor.management.dto.VisitorDTO;
import com.visitor.management.response.ApiResponse;
import com.visitor.management.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@CrossOrigin("*")
public class SearchController {

    private final SearchService service;

    @GetMapping("/{visitId}")
    public ResponseEntity<ApiResponse<VisitorDTO>> searchVisitor(
            @PathVariable String visitId) {

        return ResponseEntity.ok(

                ApiResponse.<VisitorDTO>builder()

                        .success(true)

                        .message("Visitor Found")

                        .data(service.searchByVisitId(visitId))

                        .build()

        );

    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<VisitorDTO>>> activeVisitors() {

        return ResponseEntity.ok(

                ApiResponse.<List<VisitorDTO>>builder()

                        .success(true)

                        .message("Active Visitors")

                        .data(service.getActiveVisitors())

                        .build()

        );

    }

    @GetMapping("/cancelled")
    public ResponseEntity<ApiResponse<List<VisitorDTO>>> cancelledVisitors() {

        return ResponseEntity.ok(

                ApiResponse.<List<VisitorDTO>>builder()

                        .success(true)

                        .message("Cancelled Visitors")

                        .data(service.getCancelledVisitors())

                        .build()

        );

    }

}