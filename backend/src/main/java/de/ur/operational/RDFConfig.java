package de.ur.operational;

import org.eclipse.rdf4j.repository.Repository;
import org.eclipse.rdf4j.repository.RepositoryConnection;
import org.eclipse.rdf4j.repository.RepositoryException;
import org.eclipse.rdf4j.repository.sail.SailRepository;
import org.eclipse.rdf4j.rio.RDFFormat;
import org.eclipse.rdf4j.sail.memory.MemoryStore;
import org.eclipse.rdf4j.spring.RDF4JConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

import java.io.IOException;

@Configuration
@Import(RDF4JConfig.class)
public class RDFConfig {
    @Bean
    public Repository rdf4jRepository() throws IOException {
        MemoryStore store = new MemoryStore();
        Repository repository = new SailRepository(store);
        repository.init();

        try (RepositoryConnection conn = repository.getConnection()) {
            conn.begin();
            conn.add(RDFConfig.class.getResourceAsStream("/OperationalOntology.rdf"), "", RDFFormat.RDFXML);
            conn.commit();
        }

        return repository;
    }

    @Bean
    public RepositoryConnection repositoryConnection(Repository repository) throws RepositoryException {
        return repository.getConnection();
    }
}
