package de.ur.operational.service;

import de.ur.operational.model.Tool;
import de.ur.operational.model.ToolStatus;
import de.ur.operational.model.ToolType;
import de.ur.operational.repository.ToolRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ToolService {
    final ToolRepository repository;

    public ToolService(ToolRepository repository) {
        this.repository = repository;
    }

    public List<Tool> getAll() {
        return repository.findAll();
    }

    public Tool createTool(Tool tool) {
        return repository.save(tool);
    }

    public Tool getTool(String externalId) {
        return repository.findByExternalId(externalId);
    }

    public void setToolStateById(String toolId, ToolStatus toolStatus) {
        Tool tool = repository.findByExternalId(toolId);
        tool.setStatus(toolStatus);
        repository.save(tool);
    }

    public List<ToolType> getAllToolTypes() {
        return List.of(ToolType.values());
    }
}
