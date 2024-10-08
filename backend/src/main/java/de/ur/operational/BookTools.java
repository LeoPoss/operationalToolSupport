package de.ur.operational;

import de.ur.operational.model.ToolStatus;
import de.ur.operational.service.ToolService;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class BookTools implements JavaDelegate {
    final ToolService toolService;

    public BookTools(ToolService toolService) {
        this.toolService = toolService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        List<String> useToolsToBook = (ArrayList<String>) execution.getVariable("currentTools");
        useToolsToBook.forEach((t) -> toolService.setToolStateById(t, ToolStatus.IN_USE));
    }
}
