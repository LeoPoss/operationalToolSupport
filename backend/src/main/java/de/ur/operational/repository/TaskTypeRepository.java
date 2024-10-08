package de.ur.operational.repository;

import de.ur.operational.model.TaskType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskTypeRepository extends JpaRepository<TaskType, Long> {
    TaskType findTaskTypeByName(String name);
}
