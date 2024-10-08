package de.ur.operational.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.eclipse.rdf4j.model.IRI;
import org.eclipse.rdf4j.query.BindingSet;
import org.eclipse.rdf4j.sparqlbuilder.core.SparqlBuilder;
import org.eclipse.rdf4j.sparqlbuilder.core.Variable;

import static de.ur.operational.Util.getLiteralValue;


@Data
@AllArgsConstructor
public class ToolRDF {

    public static final Variable TOOL_ID = SparqlBuilder.var("tool");
    public static final Variable TOOL_NAME = SparqlBuilder.var("name");
    public static final Variable TOOL_BRAND = SparqlBuilder.var("brand");
    public static final Variable TOOL_DESCRIPTION = SparqlBuilder.var("description");
    private String id;
    private String name;
    private String brand;
    private String description;

    public static ToolRDF createToolFromBindingSet(BindingSet bindingSet) {
        IRI toolIRI = (IRI) bindingSet.getValue("tool");
        String nameValue = getLiteralValue(bindingSet, "name");
        String brandValue = getLiteralValue(bindingSet, "brand");
        String descriptionValue = getLiteralValue(bindingSet, "description");

        return new ToolRDF(toolIRI.getLocalName(), nameValue, brandValue, descriptionValue);
    }
}
