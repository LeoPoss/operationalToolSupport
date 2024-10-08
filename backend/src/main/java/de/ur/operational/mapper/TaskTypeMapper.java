package de.ur.operational.mapper;

import de.ur.operational.model.TaskType;
import de.ur.operational.model.TaskTypeDto;
import de.ur.operational.model.Tool;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.Set;

@Mapper
public interface TaskTypeMapper {
    TaskTypeMapper INSTANCE = Mappers.getMapper(TaskTypeMapper.class);

    @Mapping(source = "tools", target = "toolIds")
    TaskTypeDto taskToDto(TaskType taskType);

    default List<String> mapToolIds(Set<Tool> tools) {
        return tools.stream().map(Tool::getExternalId).toList();
    }
}
