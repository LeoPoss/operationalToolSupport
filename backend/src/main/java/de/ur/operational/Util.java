package de.ur.operational;

import org.eclipse.rdf4j.model.Literal;
import org.eclipse.rdf4j.model.Value;
import org.eclipse.rdf4j.query.BindingSet;

public class Util {
    public static String getLiteralValue(BindingSet bindingSet, String name) {
        Value value = bindingSet.getValue(name);
        return value instanceof Literal ? ((Literal) value).getLabel() : null;
    }
}
