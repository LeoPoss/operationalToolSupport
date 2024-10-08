package de.ur.operational.service;

import de.ur.operational.model.ManualTaskRDF;
import de.ur.operational.model.ToolRDF;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.rdf4j.model.IRI;
import org.eclipse.rdf4j.model.Literal;
import org.eclipse.rdf4j.model.Value;
import org.eclipse.rdf4j.query.BindingSet;
import org.eclipse.rdf4j.query.TupleQuery;
import org.eclipse.rdf4j.query.TupleQueryResult;
import org.eclipse.rdf4j.query.Update;
import org.eclipse.rdf4j.repository.Repository;
import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.eclipse.rdf4j.sparqlbuilder.core.Prefix;
import org.eclipse.rdf4j.sparqlbuilder.core.SparqlBuilder;
import org.eclipse.rdf4j.sparqlbuilder.core.query.Queries;
import org.eclipse.rdf4j.sparqlbuilder.core.query.SelectQuery;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import static de.ur.operational.Util.getLiteralValue;
import static de.ur.operational.model.ToolRDF.*;
import static org.eclipse.rdf4j.sparqlbuilder.rdf.Rdf.iri;

@Service
@Slf4j
public class OntologyService {
    private final Repository repository;

    private static final String NAMESPACE = "http://www.semanticweb.org/leo/ontologies/2024/5/operationalEquipment#";
    Prefix oe = SparqlBuilder.prefix("oe", iri(NAMESPACE));

    public OntologyService(Repository repository) {
        this.repository = repository;
    }

    public List<ToolRDF> queryTools() {
        List<ToolRDF> tools = new ArrayList<>();

        SelectQuery query = Queries.SELECT(TOOL_ID, TOOL_NAME, TOOL_BRAND, TOOL_DESCRIPTION)
                .prefix(oe)
                .where(
                        TOOL_ID.isA(oe.iri("Tool"))
                                .and(TOOL_ID.has(oe.iri("hasName"), TOOL_NAME).optional())
                                .and(TOOL_ID.has(oe.iri("hasBrand"), TOOL_BRAND).optional())
                                .and(TOOL_ID.has(oe.iri("hasDescription"), TOOL_DESCRIPTION).optional())
                );

        try (RepositoryConnection conn = repository.getConnection()) {
            TupleQuery tupleQuery = conn.prepareTupleQuery(query.getQueryString());
            try (TupleQueryResult result = tupleQuery.evaluate()) {
                while (result.hasNext()) {
                    BindingSet bindingSet = result.next();
                    tools.add(ToolRDF.createToolFromBindingSet(bindingSet));
                }
            }
        }
        return tools;
    }

    public ManualTaskRDF queryManualTask(String taskName) {
        String queryString = "PREFIX operationalEquipment: <http://www.semanticweb.org/leo/ontologies/2024/5/operationalEquipment#> " +
                "SELECT ?task ?tool ?toolType ?taskType WHERE { " +
                "  ?task a operationalEquipment:ManualTask ; " +
                "        operationalEquipment:taskType \"" + taskName + "\" . " +
                "  OPTIONAL { ?task operationalEquipment:requiresTool ?tool } " +
                "  OPTIONAL { ?task operationalEquipment:requiresToolType ?toolType } " +
                "  OPTIONAL { ?task operationalEquipment:taskType ?taskType } " +
                "}";

        log.info(queryString);

        ManualTaskRDF manualTask = null;

        try (RepositoryConnection conn = repository.getConnection()) {
            TupleQuery tupleQuery = conn.prepareTupleQuery(queryString);
            try (TupleQueryResult result = tupleQuery.evaluate()) {
                if (result.hasNext()) {
                    BindingSet bindingSet = result.next();
                    IRI taskIRI = (IRI) bindingSet.getValue("task");
                    String taskType = getLiteralValue(bindingSet, "taskType");
                    List<String> requiredTools = new ArrayList<>();
                    List<String> requiredToolTypes = new ArrayList<>();

                    do {
                        Value toolValue = bindingSet.getValue("tool");
                        if (toolValue != null) {
                            requiredTools.add(((IRI) toolValue).getLocalName());
                        }
                        Value toolTypeValue = bindingSet.getValue("toolType");
                        if (toolTypeValue != null) {
                            requiredToolTypes.add(((IRI) toolTypeValue).getLocalName());
                        }
                    } while (result.hasNext());

                    manualTask = new ManualTaskRDF(taskIRI.getLocalName(), taskType, requiredTools, requiredToolTypes);
                }
            }
        }
        return manualTask;
    }


    public void addTool(String name, String brand, String description) {
        String insertQuery = "PREFIX operationalEquipment: <" + NAMESPACE + "> " +
                "INSERT DATA { " +
                "  operationalEquipment:" + brand + "_" + name + " a operationalEquipment:Tool ; " +
                "    operationalEquipment:hasName \"" + name + "\" ; " +
                "    operationalEquipment:hasBrand \"" + brand + "\" ; " +
                "    operationalEquipment:hasDescription \"" + description + "\" . " +
                "}";

        try (RepositoryConnection conn = repository.getConnection()) {
            conn.prepareUpdate(insertQuery).execute();
        }
    }

    public void addUsesTool(String actorName, String toolName) {
        String updateQuery = "PREFIX operationalEquipment: <" + NAMESPACE + "> " +
                "INSERT DATA { " +
                "  operationalEquipment:" + actorName + " operationalEquipment:usesTool operationalEquipment:" + toolName + " . " +
                "}";
        executeUpdate(updateQuery);
    }

    public void updateUsesTool(String actorName, String oldToolName, String newToolName) {
        String updateQuery = "PREFIX operationalEquipment: <" + NAMESPACE + "> " +
                "DELETE { " +
                "  operationalEquipment:" + actorName + " operationalEquipment:usesTool operationalEquipment:" + oldToolName + " . " +
                "} " +
                "INSERT { " +
                "  operationalEquipment:" + actorName + " operationalEquipment:usesTool operationalEquipment:" + newToolName + " . " +
                "} " +
                "WHERE { " +
                "  operationalEquipment:" + actorName + " operationalEquipment:usesTool operationalEquipment:" + oldToolName + " . " +
                "}";
        executeUpdate(updateQuery);
    }

    public void removeUsesTool(String actorName, String toolName) {
        String updateQuery = "PREFIX operationalEquipment: <" + NAMESPACE + "> " +
                "DELETE { " +
                "  operationalEquipment:" + actorName + " operationalEquipment:usesTool operationalEquipment:" + toolName + " . " +
                "} " +
                "WHERE { " +
                "  operationalEquipment:" + actorName + " operationalEquipment:usesTool operationalEquipment:" + toolName + " . " +
                "}";
        executeUpdate(updateQuery);
    }

    public List<String> getUsedTools(String actorName) {
        List<String> tools = new ArrayList<>();
        String queryString = "PREFIX untitled-ontology-2: <" + NAMESPACE + "> " +
                "SELECT ?tool WHERE { " +
                "  untitled-ontology-2:" + actorName + " untitled-ontology-2:usesTool ?tool . " +
                "}";

        try (RepositoryConnection conn = repository.getConnection()) {
            TupleQuery tupleQuery = conn.prepareTupleQuery(queryString);
            try (TupleQueryResult result = tupleQuery.evaluate()) {
                while (result.hasNext()) {
                    BindingSet bindingSet = result.next();
                    IRI toolIRI = (IRI) bindingSet.getValue("tool");
                    tools.add(toolIRI.getLocalName());
                }
            }
        }
        return tools;
    }

    public boolean actorHasCorrectToolsForTask(String actorName, String taskName) {
        String queryString = "PREFIX operationalEquipment: <" + NAMESPACE + "> " +
                "SELECT ?actorTool ?requiredTool ?requiredToolType WHERE { " +
                "  operationalEquipment:" + actorName + " operationalEquipment:usesTool ?actorTool . " +
                "  operationalEquipment:" + taskName + " a operationalEquipment:ManualTask . " +
                "  OPTIONAL { operationalEquipment:" + taskName + " operationalEquipment:requiresTool ?requiredTool } " +
                "  OPTIONAL { " +
                "    operationalEquipment:" + taskName + " operationalEquipment:requiresToolType ?requiredToolType . " +
                "    ?actorTool operationalEquipment:hasToolType ?requiredToolType . " +
                "  } " +
                "}";

        boolean hasAllRequiredTools = true;
        boolean hasAnyRequiredTool = false;

        try (RepositoryConnection conn = repository.getConnection()) {
            TupleQuery tupleQuery = conn.prepareTupleQuery(queryString);
            try (TupleQueryResult result = tupleQuery.evaluate()) {
                while (result.hasNext()) {
                    BindingSet bindingSet = result.next();
                    Value requiredTool = bindingSet.getValue("requiredTool");
                    Value requiredToolType = bindingSet.getValue("requiredToolType");

                    if (requiredTool != null || requiredToolType != null) {
                        hasAnyRequiredTool = true;
                        Value actorTool = bindingSet.getValue("actorTool");
                        if (actorTool == null ||
                                (requiredTool != null && !actorTool.equals(requiredTool) && requiredToolType == null)) {
                            hasAllRequiredTools = false;
                            break;
                        }
                    }
                }
            }
        }

        return hasAnyRequiredTool && hasAllRequiredTools;
    }

    public boolean actorToolsMatchTaskRequirements(String actorName, String taskName) {
        String queryString = "PREFIX operationalEquipment: <" + NAMESPACE + "> " +
                "SELECT ?requiredToolType (COUNT(DISTINCT ?actorTool) AS ?matchingTools) WHERE { " +
                "  operationalEquipment:" + taskName + " a operationalEquipment:ManualTask . " +
                "  operationalEquipment:" + taskName + " operationalEquipment:requiresToolType ?requiredToolType . " +
                "  operationalEquipment:" + actorName + " operationalEquipment:usesTool ?actorTool . " +
                "  ?actorTool operationalEquipment:hasToolType ?requiredToolType . " +
                "} GROUP BY ?requiredToolType";

        boolean allRequirementsMet = true;
        boolean hasRequirements = false;

        try (RepositoryConnection conn = repository.getConnection()) {
            TupleQuery tupleQuery = conn.prepareTupleQuery(queryString);
            try (TupleQueryResult result = tupleQuery.evaluate()) {
                while (result.hasNext()) {
                    hasRequirements = true;
                    BindingSet bindingSet = result.next();
                    int matchingTools = ((Literal) bindingSet.getValue("matchingTools")).intValue();
                    if (matchingTools == 0) {
                        allRequirementsMet = false;
                        break;
                    }
                }
            }
        }

        return hasRequirements && allRequirementsMet;
    }

    private void executeUpdate(String updateQuery) {
        try (RepositoryConnection conn = repository.getConnection()) {
            Update update = conn.prepareUpdate(updateQuery);
            update.execute();
        }
    }
}
