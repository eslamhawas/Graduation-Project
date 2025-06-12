package com.nextronica.server.dtos;


import lombok.Data;

@Data
public class PaginationDto {
    private int page;
    private int size;
    private int totalPages;
    private long totalElements;
    private int numberOfElements;
}
