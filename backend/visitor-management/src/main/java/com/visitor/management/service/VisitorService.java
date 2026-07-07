package com.visitor.management.service;

import com.visitor.management.dto.VisitorDTO;

import java.util.List;

public interface VisitorService {

    VisitorDTO registerVisitor(VisitorDTO visitorDTO);

    VisitorDTO updateVisitor(Long id, VisitorDTO visitorDTO);

    VisitorDTO getVisitorById(Long id);

    VisitorDTO getVisitorByVisitId(String visitId);

    List<VisitorDTO> getAllVisitors();

    List<VisitorDTO> getVisitorsByEmployee(String employeeId);

    List<VisitorDTO> getTodayVisitors();

    VisitorDTO cancelVisitor(Long id);

    VisitorDTO checkInVisitor(String visitId);

    VisitorDTO checkOutVisitor(String visitId);

}