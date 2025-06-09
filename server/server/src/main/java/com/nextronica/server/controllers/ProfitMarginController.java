package com.nextronica.server.controllers;

import com.nextronica.server.dtos.requests.AddProfitMarginRequestDto;
import com.nextronica.server.models.ProfitMargin;
import com.nextronica.server.services.ProfitMarginService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/commission")
public class ProfitMarginController {

    private final ProfitMarginService profitMarginService;

    public ProfitMarginController(ProfitMarginService profitMarginService) {
        this.profitMarginService = profitMarginService;
    }


    @PostMapping
    public ResponseEntity<ProfitMargin> addProfitMargin(@RequestBody @Valid AddProfitMarginRequestDto addProfitMarginRequestDto) {
        ProfitMargin newProfitMargin = profitMarginService.addProfitMargin(addProfitMarginRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newProfitMargin);
    }

    @GetMapping("/last")
    public ResponseEntity<ProfitMargin> getLastProfitMargin() {
        ProfitMargin lastProfitMargin = profitMarginService.getLastProfitMargin();
        if (lastProfitMargin != null) {
            return ResponseEntity.ok(lastProfitMargin);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}