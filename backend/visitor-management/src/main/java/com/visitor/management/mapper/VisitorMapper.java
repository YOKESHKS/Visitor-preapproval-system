package com.visitor.management.mapper;

import com.visitor.management.dto.VisitorDTO;
import com.visitor.management.entity.Visitor;

public class VisitorMapper {

    public static Visitor toEntity(VisitorDTO dto) {

        return Visitor.builder()
                .id(dto.getId())
                .visitId(dto.getVisitId())
                .hostEmployeeId(dto.getHostEmployeeId())
                .hostEmployeeName(dto.getHostEmployeeName())
                .visitorName(dto.getVisitorName())
                .companyName(dto.getCompanyName())
                .governmentId(dto.getGovernmentId())
                .mobileNumber(dto.getMobileNumber())
                .email(dto.getEmail())
                .purpose(dto.getPurpose())
                .visitDate(dto.getVisitDate())
                .expectedInTime(dto.getExpectedInTime())
                .expectedOutTime(dto.getExpectedOutTime())
                .numberOfVisitors(dto.getNumberOfVisitors())
                .remarks(dto.getRemarks())
                .status(dto.getStatus())
                .qrPath(dto.getQrPath())
                .checkInTime(dto.getCheckInTime())
                .checkOutTime(dto.getCheckOutTime())
                .cancelled(dto.getCancelled())
                .active(dto.getActive())
                .build();
    }

    public static VisitorDTO toDTO(Visitor visitor) {

        return VisitorDTO.builder()
                .id(visitor.getId())
                .visitId(visitor.getVisitId())
                .hostEmployeeId(visitor.getHostEmployeeId())
                .hostEmployeeName(visitor.getHostEmployeeName())
                .visitorName(visitor.getVisitorName())
                .companyName(visitor.getCompanyName())
                .governmentId(visitor.getGovernmentId())
                .mobileNumber(visitor.getMobileNumber())
                .email(visitor.getEmail())
                .purpose(visitor.getPurpose())
                .visitDate(visitor.getVisitDate())
                .expectedInTime(visitor.getExpectedInTime())
                .expectedOutTime(visitor.getExpectedOutTime())
                .numberOfVisitors(visitor.getNumberOfVisitors())
                .remarks(visitor.getRemarks())
                .status(visitor.getStatus())
                .qrPath(visitor.getQrPath())
                .checkInTime(visitor.getCheckInTime())
                .checkOutTime(visitor.getCheckOutTime())
                .cancelled(visitor.getCancelled())
                .active(visitor.getActive())
                .build();
    }

}