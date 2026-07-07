package com.visitor.management.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Component;

import java.nio.file.FileSystems;
import java.nio.file.Path;

@Component
public class QRCodeGenerator {

    public String generateQRCode(String visitId) {

        try {

            String folder = "qr/";

            java.io.File file = new java.io.File(folder);

            if (!file.exists()) {
                file.mkdirs();
            }

            String fileName = folder + visitId + ".png";

            QRCodeWriter writer = new QRCodeWriter();

            BitMatrix bitMatrix = writer.encode(
                    visitId,
                    BarcodeFormat.QR_CODE,
                    300,
                    300
            );

            Path path = FileSystems.getDefault().getPath(fileName);

            MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);

            return fileName;

        } catch (Exception e) {

            throw new RuntimeException(e.getMessage());

        }

    }

}