package com.visitor.management.controller;

import com.visitor.management.dto.VisitorDTO;
import com.visitor.management.response.ApiResponse;
import com.visitor.management.service.VisitorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/visitors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VisitorController {

    private final VisitorService service;

    @PostMapping
    public ResponseEntity<ApiResponse<VisitorDTO>> registerVisitor(
            @RequestBody VisitorDTO dto) {
        return ResponseEntity.ok(
                ApiResponse.<VisitorDTO>builder()
                        .success(true)
                        .message("Visitor Registered Successfully")
                        .data(service.registerVisitor(dto))
                        .build()
        );
    }

    /* ========================================================================= */
    /* 1. FIXED PATH STRINGS FIRST (Prevents NumberFormatException routing bugs) */
    /* ========================================================================= */

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<VisitorDTO>>> todayVisitors() {
        return ResponseEntity.ok(
                ApiResponse.<List<VisitorDTO>>builder()
                        .success(true)
                        .message("Success")
                        .data(service.getTodayVisitors())
                        .build()
        );
    }

    @GetMapping("/visit/{visitId}")
    public ResponseEntity<ApiResponse<VisitorDTO>> getByVisitId(
            @PathVariable String visitId) {
        return ResponseEntity.ok(
                ApiResponse.<VisitorDTO>builder()
                        .success(true)
                        .message("Success")
                        .data(service.getVisitorByVisitId(visitId))
                        .build()
        );
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<VisitorDTO>>> employeeVisitors(
            @PathVariable String employeeId) {
        return ResponseEntity.ok(
                ApiResponse.<List<VisitorDTO>>builder()
                        .success(true)
                        .message("Success")
                        .data(service.getVisitorsByEmployee(employeeId))
                        .build()
        );
    }

    /* ========================================================================= */
    /* 2. DYNAMIC LONGS / WILDCARDS LAST                                         */
    /* ========================================================================= */

    @GetMapping
    public ResponseEntity<ApiResponse<List<VisitorDTO>>> getAllVisitors() {
        return ResponseEntity.ok(
                ApiResponse.<List<VisitorDTO>>builder()
                        .success(true)
                        .message("Success")
                        .data(service.getAllVisitors())
                        .build()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VisitorDTO>> getVisitor(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.<VisitorDTO>builder()
                        .success(true)
                        .message("Success")
                        .data(service.getVisitorById(id))
                        .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<VisitorDTO>> updateVisitor(
            @PathVariable Long id,
            @RequestBody VisitorDTO dto) {
        return ResponseEntity.ok(
                ApiResponse.<VisitorDTO>builder()
                        .success(true)
                        .message("Visitor Updated Successfully")
                        .data(service.updateVisitor(id, dto))
                        .build()
        );
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<ApiResponse<VisitorDTO>> cancelVisitor(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.<VisitorDTO>builder()
                        .success(true)
                        .message("Visitor Cancelled")
                        .data(service.cancelVisitor(id))
                        .build()
        );
    }

    @PutMapping("/checkin/{visitId}")
    public ResponseEntity<ApiResponse<VisitorDTO>> checkIn(
            @PathVariable String visitId) {
        return ResponseEntity.ok(
                ApiResponse.<VisitorDTO>builder()
                        .success(true)
                        .message("Visitor Checked In")
                        .data(service.checkInVisitor(visitId))
                        .build()
        );
    }

    @PutMapping("/checkout/{visitId}")
    public ResponseEntity<ApiResponse<VisitorDTO>> checkOut(
            @PathVariable String visitId) {
        return ResponseEntity.ok(
                ApiResponse.<VisitorDTO>builder()
                        .success(true)
                        .message("Visitor Checked Out")
                        .data(service.checkOutVisitor(visitId))
                        .build()
        );
    }
}