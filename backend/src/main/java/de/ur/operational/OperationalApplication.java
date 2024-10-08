package de.ur.operational;

import de.ur.operational.model.TaskType;
import de.ur.operational.model.Tool;
import de.ur.operational.model.ToolType;
import de.ur.operational.service.TaskTypeService;
import de.ur.operational.service.ToolService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.spring.boot.starter.annotation.EnableProcessApplication;
import org.eclipse.rdf4j.spring.support.RDF4JTemplate;
import org.eclipse.rdf4j.spring.util.QueryResultUtils;
import org.eclipse.rdf4j.spring.util.TypeMappingUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;
import java.util.Set;

@EnableProcessApplication
@SpringBootApplication
@Slf4j
public class OperationalApplication {
    @Autowired
    private TaskTypeService taskTypeService;
    @Autowired
    private ToolService toolService;
    @Autowired
    private RDF4JTemplate rdf4JTemplate;

    public static void main(String[] args) {
        SpringApplication.run(OperationalApplication.class, args);
    }

    @PostConstruct
    public void init() {
        List<Tool> tools = List.of(new Tool("MAK001", "Test Tool", "Makita", "HP2091E", ToolType.DRILLING_MACHINE), new Tool("MAK002", "Test Tool", "Makita", "HP2071F", ToolType.DRILLING_MACHINE), new Tool("BOS001", "Test Tool3", "Bosch", "GKS 190", ToolType.CIRCULAR_HAND_SAW));
        tools.forEach((toolService::createTool));

        List<TaskType> taskTypes = List.of(new TaskType("build"), new TaskType("repair"), new TaskType("tearDown"));
        taskTypes.get(0).setTools(Set.of(tools.get(1)));
        taskTypes.get(1).setTools(Set.of(tools.get(1), tools.get(2)));
        taskTypes.get(2).setToolTypes(Set.of(ToolType.DRILLING_HAMMER, ToolType.CIRCULAR_HAND_SAW));

        taskTypes.forEach(taskTypeService::createTaskType);

        int count = rdf4JTemplate
                .tupleQuery("SELECT (count(?a) as ?cnt) WHERE { ?a ?b ?c }")
                .evaluateAndConvert()
                .toSingleton(bs -> TypeMappingUtils.toInt(QueryResultUtils.getValue(bs, "cnt")));

        log.info("Count: " + count);
    }

    @Bean
    public FilterRegistrationBean<CorsFilter> processCorsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);

        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<CorsFilter>(new CorsFilter(source));
        bean.setOrder(0);
        return bean;
    }
}
