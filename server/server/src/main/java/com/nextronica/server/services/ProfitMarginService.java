package com.nextronica.server.services;


import com.nextronica.server.dtos.requests.AddProfitMarginRequestDto;
import com.nextronica.server.models.ProfitMargin;
import com.nextronica.server.repositories.ProfitMarginRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ProfitMarginService {

    private final ProfitMarginRepository profitMarginRepository;
    private final ModelMapper modelMapper;


    public ProfitMarginService(ProfitMarginRepository profitMarginRepository, ModelMapper modelMapper) {
        this.profitMarginRepository = profitMarginRepository;
        this.modelMapper = modelMapper;
    }

    public ProfitMargin addProfitMargin(AddProfitMarginRequestDto profitMargin) {
        Optional<ProfitMargin> lastProfitMargin = profitMarginRepository.findTopByOrderByCreatedDateDesc();
        ProfitMargin lastProfitMarginObject;
        if (lastProfitMargin.isPresent()) {
            lastProfitMarginObject = lastProfitMargin.get();
            lastProfitMarginObject.setEndDate(LocalDateTime.now());
            profitMarginRepository.save(lastProfitMarginObject);
        }
        ProfitMargin newProfitMargin = modelMapper.map(profitMargin, ProfitMargin.class);
        return profitMarginRepository.save(newProfitMargin);
    }

    public ProfitMargin getLastProfitMargin() {
        Optional<ProfitMargin> lastProfitMargin = profitMarginRepository.findTopByOrderByCreatedDateDesc();
        return lastProfitMargin.orElse(null);
    }
}
