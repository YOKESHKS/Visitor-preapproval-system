package com.visitor.management.controller;

import com.visitor.management.response.ApiResponse;
import com.visitor.management.service.QRCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;

@RestController
@RequestMapping("/api/qrcode")
@RequiredArgsConstructor
@CrossOrigin("*")
public class QRCodeController {

    private final QRCodeService service;

    @PostMapping("/{visitId}")
    public ResponseEntity<ApiResponse<String>> generateQRCode(
            @PathVariable String visitId) {

        return ResponseEntity.ok(

                ApiResponse.<String>builder()

                        .success(true)

                        .message("QR Generated Successfully")

                        .data(service.generate(visitId))

                        .build()

        );

    }

    @GetMapping("/download/{visitId}")
    public ResponseEntity<FileSystemResource> downloadQR(
            @PathVariable String visitId) {

        File file = new File("qr/" + visitId + ".png");

        return ResponseEntity.ok()

                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=" + visitId + ".png")

                .body(new FileSystemResource(file));

    }

}