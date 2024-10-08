package de.ur.operational;

import de.ur.operational.model.ToolStatus;
import de.ur.operational.service.ToolService;
import org.camunda.bpm.engine.delegate.DelegateTask;
import org.camunda.bpm.engine.delegate.TaskListener;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ReturnTools implements TaskListener {
    final ToolService toolService;

    public ReturnTools(ToolService toolService) {
        this.toolService = toolService;
    }

    @Override
    public void notify(DelegateTask delegateTask) {
        List<String> useToolsToBook = (ArrayList<String>) delegateTask.getExecution().getVariable("currentTools");
        useToolsToBook.forEach((t) -> toolService.setToolStateById(t, ToolStatus.AVAILABLE));

    }
}
