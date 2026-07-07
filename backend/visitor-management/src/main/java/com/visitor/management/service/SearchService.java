package com.visitor.management.service;

import com.visitor.management.dto.VisitorDTO;

import java.util.List;

public interface SearchService {

    VisitorDTO searchByVisitId(String visitId);

    List<VisitorDTO> getActiveVisitors();

    List<VisitorDTO> getCancelledVisitors();

}