package de.ur.operational.controller;

import de.ur.operational.model.ManualTaskRDF;
import de.ur.operational.model.ToolRDF;
import de.ur.operational.service.OntologyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rdf")
public class RDFController {
    @Autowired
    private OntologyService ontologyService;

    @GetMapping("/tools")
    public List<ToolRDF> getTools() {
        return ontologyService.queryTools();
    }

    @PostMapping("/tools")
    public ResponseEntity<String> addTool(@RequestParam("name") String name, @RequestParam("brand") String brand, @RequestParam(value = "description", required = false) String description) {
        ontologyService.addTool(name, brand, description);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/manual-task/{taskName}")
    public ResponseEntity<ManualTaskRDF> getManualTask(@PathVariable String taskName) {
        ManualTaskRDF manualTask = ontologyService.queryManualTask(taskName);
        if (manualTask != null) {
            return ResponseEntity.ok(manualTask);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{actorName}/tool/{toolName}")
    public ResponseEntity<Void> addUsesTool(@PathVariable String actorName, @PathVariable String toolName) {
        ontologyService.addUsesTool(actorName, toolName);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{actorName}/tool/{oldToolName}/{newToolName}")
    public ResponseEntity<Void> updateUsesTool(@PathVariable String actorName, @PathVariable String oldToolName, @PathVariable String newToolName) {
        ontologyService.updateUsesTool(actorName, oldToolName, newToolName);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{actorName}/tool/{toolName}")
    public ResponseEntity<Void> removeUsesTool(@PathVariable String actorName, @PathVariable String toolName) {
        ontologyService.removeUsesTool(actorName, toolName);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{actorName}/tools")
    public ResponseEntity<List<String>> getUsedTools(@PathVariable String actorName) {
        List<String> tools = ontologyService.getUsedTools(actorName);
        return ResponseEntity.ok(tools);
    }

    @GetMapping("/{actorName}/hasToolsForTask/{taskName}")
    public ResponseEntity<Boolean> checkActorToolsForTask(@PathVariable String actorName, @PathVariable String taskName) {
        boolean hasCorrectTools = ontologyService.actorHasCorrectToolsForTask(actorName, taskName);
        return ResponseEntity.ok(hasCorrectTools);
    }

    @GetMapping("/{actorName}/hasToolTypesForTask/{taskName}")
    public ResponseEntity<Boolean> checkActorToolTypesForTask(@PathVariable String actorName, @PathVariable String taskName) {
        boolean hasCorrectToolTypes = ontologyService.actorToolsMatchTaskRequirements(actorName, taskName);
        return ResponseEntity.ok(hasCorrectToolTypes);
    }
}