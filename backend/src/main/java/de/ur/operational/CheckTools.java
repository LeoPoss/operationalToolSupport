package de.ur.operational;

import de.ur.operational.model.TaskType;
import de.ur.operational.model.Tool;
import de.ur.operational.model.ToolType;
import de.ur.operational.service.TaskTypeService;
import de.ur.operational.service.ToolService;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Component
public class CheckTools implements JavaDelegate {
    final TaskTypeService taskTypeService;
    final ToolService toolService;

    public CheckTools(TaskTypeService taskTypeService, ToolService toolService) {
        this.taskTypeService = taskTypeService;
        this.toolService = toolService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        String taskTypeName = (String) execution.getVariable("taskType");
        TaskType taskType = taskTypeService.getByName(taskTypeName);
        List<String> currentToolsIds = (ArrayList<String>) execution.getVariable("currentTools");

        List<String> neededToolIds = taskType.getTools().stream().map(Tool::getExternalId).toList();
        Set<ToolType> neededToolTypeSet = taskType.getToolTypes();
        
        boolean hasCorrectTools = neededToolIds.isEmpty();
        boolean hasCorrectToolsForToolTypes = neededToolTypeSet.isEmpty();

        
        if (!neededToolIds.isEmpty()) {
            hasCorrectTools = hasCorrectTools(currentToolsIds, neededToolIds);
        }

        if (!neededToolTypeSet.isEmpty()) {
            hasCorrectToolsForToolTypes = hasCorrectToolsForToolTypes(currentToolsIds, neededToolTypeSet);
        }

        if (hasCorrectTools && hasCorrectToolsForToolTypes) {
            execution.setVariable("hasCorrectTools", true);
            System.out.println("hasCorrectTools_all: true");
        } else {
            execution.setVariable("hasCorrectTools", false);
            System.out.println("hasCorrectTools_all: false");
        }

    }

    private boolean hasCorrectTools(List<String> currentToolIds, List<String> neededToolIds) {
        Set<String> neededToolIdSet = new HashSet<>(neededToolIds);
        Set<String> currentToolIdSet = new HashSet<>(currentToolIds);
        return currentToolIdSet.containsAll(neededToolIdSet);
    }

    private boolean hasCorrectToolsForToolTypes(List<String> currentToolIds, Set<ToolType> neededToolTypeSet) {
        Set<ToolType> currentToolTypes = currentToolIds.stream().map(toolService::getTool).map(Tool::getType).collect(Collectors.toSet());

        return currentToolTypes.containsAll(neededToolTypeSet);
    }
}
