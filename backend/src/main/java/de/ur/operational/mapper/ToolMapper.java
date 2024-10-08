package de.ur.operational.mapper;

import de.ur.operational.model.Tool;
import de.ur.operational.model.ToolDto;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ToolMapper {
    ToolMapper INSTANCE = Mappers.getMapper(ToolMapper.class);

    ToolDto toolToDto(Tool tool);

    @InheritInverseConfiguration
    @Mapping(target = "taskTypes", ignore = true)
    @Mapping(target = "id", ignore = true)
    Tool toolDtoToTool(ToolDto toolDto);
}
