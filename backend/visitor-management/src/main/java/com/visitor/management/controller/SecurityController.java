package com.visitor.management.controller;

import com.visitor.management.dto.CheckInOutDTO;
import com.visitor.management.dto.VisitorDTO;
import com.visitor.management.response.ApiResponse;
import com.visitor.management.service.SecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security")
@RequiredArgsConstructor
@CrossOrigin("*")
public class SecurityController {

    private final SecurityService service;

    @PutMapping("/approve/{visitId}")
    public ResponseEntity<ApiResponse<VisitorDTO>> approveVisitor(@PathVariable String visitId) {
        return ResponseEntity.ok(
                ApiResponse.<VisitorDTO>builder()
                        .success(true)
                        .message("Visitor Request Approved Successfully")
                        .data(service.approveVisitorRequest(visitId)) // Add this method signature to your service
                        .build()
        );
    }

    @GetMapping("/today")
    public ResponseEntity<ApiResponse<List<VisitorDTO>>> todayVisitors() {
        return ResponseEntity.ok(
                ApiResponse.<List<VisitorDTO>>builder()
                        .success(true)
                        .message("Today's Visitors")
                        .data(service.getTodayVisitors())
                        .build()
        );
    }

    @GetMapping("/inside")
    public ResponseEntity<ApiResponse<List<VisitorDTO>>> insideVisitors() {
        return ResponseEntity.ok(
                ApiResponse.<List<VisitorDTO>>builder()
                        .success(true)
                        .message("Visitors Inside Company")
                        .data(service.getVisitorsInside())
                        .build()
        );
    }

    @PutMapping("/checkin/{visitId}")
    public ResponseEntity<ApiResponse<CheckInOutDTO>> checkIn(@PathVariable String visitId) {
        return ResponseEntity.ok(
                ApiResponse.<CheckInOutDTO>builder()
                        .success(true)
                        .message("Checked In Successfully")
                        .data(service.checkIn(visitId))
                        .build()
        );
    }

    @PutMapping("/checkout/{visitId}")
    public ResponseEntity<ApiResponse<CheckInOutDTO>> checkOut(@PathVariable String visitId) {
        return ResponseEntity.ok(
                ApiResponse.<CheckInOutDTO>builder()
                        .success(true)
                        .message("Checked Out Successfully")
                        .data(service.checkOut(visitId))
                        .build()
        );
    }
}