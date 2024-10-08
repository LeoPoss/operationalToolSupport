package de.ur.operational.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ToolType {
    DRILLING_MACHINE,
    CIRCULAR_SAW,
    DRILLING_SCRUBBER,
    DRILLING_HAMMER,
    CHAIN_SAW,
    CIRCULAR_HAND_SAW;

    @JsonCreator
    public static ToolType fromString(String value) {
        String normalizedValue = normalize(value);
        for (ToolType type : ToolType.values()) {
            if (type.name().equalsIgnoreCase(normalizedValue)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown enum value: " + value);
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }

    private static String normalize(String value) {
        return value
                .replace("Ä", "AE")
                .replace("Ö", "OE")
                .replace("Ü", "UE")
                .replace("ä", "ae")
                .replace("ö", "oe")
                .replace("ü", "ue")
                .replace("ß", "ss");
    }
}
