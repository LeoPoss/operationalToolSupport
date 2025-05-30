package de.ur.operational.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskTypeDto {
    private String id;
    private String name;
    private List<String> toolIds;
    private List<String> toolTypes;
}
