package de.ur.operational.repository;

import de.ur.operational.model.Tool;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ToolRepository extends JpaRepository<Tool, Long> {
    Tool findByExternalId(String externalId);
}
