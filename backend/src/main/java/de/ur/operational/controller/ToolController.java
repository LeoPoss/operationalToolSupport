package de.ur.operational.controller;

import de.ur.operational.mapper.ToolMapper;
import de.ur.operational.model.Tool;
import de.ur.operational.model.ToolDto;
import de.ur.operational.model.ToolStatus;
import de.ur.operational.model.ToolType;
import de.ur.operational.service.ToolService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
public class ToolController {
    final ToolService toolService;

    public ToolController(ToolService toolService) {
        this.toolService = toolService;
    }

    @GetMapping("/tools")
    List<ToolDto> getAllTools() {
        List<Tool> tools = toolService.getAll();
        return tools.stream().map(ToolMapper.INSTANCE::toolToDto).toList();
    }

    @PostMapping("tools")
    Tool newTool(@RequestBody ToolDto toolDto) {
        Tool newTool = ToolMapper.INSTANCE.toolDtoToTool(toolDto);
        newTool.setStatus(ToolStatus.AVAILABLE);
        return toolService.createTool(newTool);
    }


    @GetMapping("/tools/types")
    List<ToolType> getToolTypes() {
        return toolService.getAllToolTypes();
    }
}
