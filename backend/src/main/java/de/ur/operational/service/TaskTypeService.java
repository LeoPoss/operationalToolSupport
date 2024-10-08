package de.ur.operational.service;

import de.ur.operational.model.TaskType;
import de.ur.operational.model.Tool;
import de.ur.operational.model.ToolType;
import de.ur.operational.repository.TaskTypeRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TaskTypeService {
    final TaskTypeRepository repository;
    final ToolService toolService;

    public TaskTypeService(TaskTypeRepository repository, ToolService toolService) {
        this.repository = repository;
        this.toolService = toolService;
    }


    public List<TaskType> getAll() {
        return repository.findAll();
    }

    public TaskType getByName(String name) {
        return repository.findTaskTypeByName(name);
    }

    public TaskType createTaskType(TaskType taskType) {
        return repository.save(taskType);
    }

    public TaskType setNeededTools(long typeId, List<String> toolIds) {
        Set<Tool> neededTools = toolIds.stream().map(toolService::getTool).collect(Collectors.toSet());
        TaskType taskType = repository.findById(typeId).orElseThrow(NotFoundException::new);
        taskType.setTools(neededTools);
        repository.save(taskType);
        return taskType;
    }

    public TaskType setNeededToolTypes(Long typeId, Set<ToolType> toolTypes) {
        TaskType taskType = repository.findById(typeId).orElseThrow(NotFoundException::new);
        taskType.setToolTypes(toolTypes);
        repository.save(taskType);
        return taskType;
    }
}
