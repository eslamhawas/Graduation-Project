package com.nextronica.server.dtos;

import com.fasterxml.jackson.annotation.JsonAnyGetter;

import java.util.HashMap;
import java.util.Map;

public class ResponseDto {
    private final Map<String, Object> map;

    public ResponseDto() {
        this.map = new HashMap<>();
    }

    public void put(String key, Object value) {
        map.put(key, value);
    }

    public Object get(String key) {
        return map.get(key);
    }

    @JsonAnyGetter
    public Map<String, Object> getMap() {
        return map;
    }
}
