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
public class Tool {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @NonNull
    private String externalId;
    @NonNull
    private String name;
    @NonNull
    private String brand;
    @NonNull
    private String model;
    @NonNull
    private ToolType type;
    private String description;
    private ToolStatus status = ToolStatus.AVAILABLE;

    @ManyToMany(mappedBy = "tools")
    private Set<TaskType> taskTypes;
}
