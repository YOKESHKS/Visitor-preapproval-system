package com.visitor.management.controller;

import com.visitor.management.dto.RegistrationFreezeDTO;
import com.visitor.management.response.ApiResponse;
import com.visitor.management.service.RegistrationFreezeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/freeze")
@RequiredArgsConstructor
@CrossOrigin("*")
public class RegistrationFreezeController {

    private final RegistrationFreezeService service;

    @PostMapping
    public ResponseEntity<ApiResponse<RegistrationFreezeDTO>> freeze(@RequestBody RegistrationFreezeDTO dto){

        return ResponseEntity.ok(

                ApiResponse.<RegistrationFreezeDTO>builder()

                        .success(true)

                        .message("Registration Frozen")

                        .data(service.freezeDate(dto))

                        .build()

        );

    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RegistrationFreezeDTO>> unFreeze(@PathVariable Long id){

        return ResponseEntity.ok(

                ApiResponse.<RegistrationFreezeDTO>builder()

                        .success(true)

                        .message("Registration Opened")

                        .data(service.unFreeze(id))

                        .build()

        );

    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RegistrationFreezeDTO>>> getAll(){

        return ResponseEntity.ok(

                ApiResponse.<List<RegistrationFreezeDTO>>builder()

                        .success(true)

                        .message("Success")

                        .data(service.getAllFreezeDates())

                        .build()

        );

    }

    @GetMapping("/{date}")
    public ResponseEntity<ApiResponse<RegistrationFreezeDTO>> getByDate(@PathVariable String date){

        return ResponseEntity.ok(

                ApiResponse.<RegistrationFreezeDTO>builder()

                        .success(true)

                        .message("Success")

                        .data(service.getFreeze(LocalDate.parse(date)))

                        .build()

        );

    }

}