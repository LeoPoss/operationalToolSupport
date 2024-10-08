package de.ur.operational.controller;

import de.ur.operational.mapper.TaskTypeMapper;
import de.ur.operational.model.TaskType;
import de.ur.operational.model.TaskTypeDto;
import de.ur.operational.model.ToolType;
import de.ur.operational.service.TaskTypeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
public class TaskTypeController {
    final TaskTypeService taskTypeService;

    public TaskTypeController(TaskTypeService taskTypeService) {
        this.taskTypeService = taskTypeService;
    }

    @GetMapping("/tasktype")
    List<TaskTypeDto> getAllTaskTypes() {
        List<TaskType> taskTypes = taskTypeService.getAll();
        return taskTypes.stream().map(TaskTypeMapper.INSTANCE::taskToDto).toList();
    }

    @PostMapping("/tasktype/{typeId}/tools")
    TaskTypeDto setNeededTools(@RequestBody List<String> toolIds, @PathVariable(value = "typeId") Long typeId) {
        TaskType taskType = taskTypeService.setNeededTools(typeId, toolIds);
        return TaskTypeMapper.INSTANCE.taskToDto(taskType);
    }


    @PostMapping("/tasktype/{typeId}/toolTypes")
    TaskTypeDto setNeededToolTypes(@RequestBody Set<ToolType> toolTypes, @PathVariable(value = "typeId") Long typeId) {
        TaskType taskType = taskTypeService.setNeededToolTypes(typeId, toolTypes);
        return TaskTypeMapper.INSTANCE.taskToDto(taskType);
    }

}
