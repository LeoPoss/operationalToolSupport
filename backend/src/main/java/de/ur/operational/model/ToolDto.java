package de.ur.operational.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ToolDto {
    private String externalId;
    private String name;
    private String brand;
    private String model;
    private ToolType type;
    private String description;
    private ToolStatus status;
}
