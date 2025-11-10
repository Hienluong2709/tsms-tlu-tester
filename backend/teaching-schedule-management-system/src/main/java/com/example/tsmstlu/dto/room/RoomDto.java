package com.example.tsmstlu.dto.room;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RoomDto {
    private Long id;
    private String code;
    private String name;
    private String building;
    private String floor;
    private String capacity;
    private String type;
    private String status;
    private String description;
}
