package com.visitor.management.service.impl;

import com.visitor.management.entity.Visitor;
import com.visitor.management.exception.ResourceNotFoundException;
import com.visitor.management.repository.VisitorRepository;
import com.visitor.management.service.QRCodeService;
import com.visitor.management.util.QRCodeGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QRCodeServiceImpl implements QRCodeService {

    private final VisitorRepository repository;

    private final QRCodeGenerator qrCodeGenerator;

    @Override
    public String generate(String visitId) {

        Visitor visitor = repository.findByVisitId(visitId)

                .orElseThrow(() ->
                        new ResourceNotFoundException("Visitor Not Found"));

        String path = qrCodeGenerator.generateQRCode(visitId);

        visitor.setQrPath(path);

        repository.save(visitor);

        return path;

    }

}