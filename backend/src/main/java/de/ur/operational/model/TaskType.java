package de.ur.operational.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@ToString
@RequiredArgsConstructor
@NoArgsConstructor
public class TaskType {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @NonNull
    private String name;

    @ManyToMany
    @JoinTable(name = "taskType_tool", joinColumns = @JoinColumn(name = "taskTypeId"), inverseJoinColumns = @JoinColumn(name = "toolId"))
    private Set<Tool> tools;

    @ElementCollection
    private Set<ToolType> toolTypes;
}
