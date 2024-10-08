package de.ur.operational.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ManualTaskRDF {
    private String id;
    private String taskType;
    private List<String> requiredTools;
    private List<String> requiredToolTypes;
}
