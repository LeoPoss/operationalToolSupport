# Formalizing the Operational Perspective in BPM: An Ontology-Based Approach for Tool Integration

This repository contains the implementation of the ontology-based approach for integrating the operational perspective
into Business Process Management (BPM), as described in our paper "Formalizing the Operational Perspective in BPM: An
Ontology-Based Approach for Tool Integration".

## Project Overview

This implementation demonstrates how to integrate passive resources, particularly operational equipment, into process
modeling and execution. It provides a practical example of using an ontology to manage tools and their relationships
with tasks and actors in a BPM context.

The project consists of several key components:

1. A Business Process Management System (BPMS) for process execution
2. An ontology management system for querying and using the operational equipment ontology
3. A backend application that integrates the BPMS and ontology (http://localhost:8080 admin:admin)
4. A web/mobile frontend application for user interaction (http://localhost:3000)

## Technologies Used

- BPMS: Camunda
- Backend: Spring Boot with RDF4J for ontology handling
- Frontend: Next.js
- Communication: REST API and WebSockets
- Ontology: RDF/OWL with SPARQL queries

## Repository Structure

```
/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── resources/
│   │   │   │   ├── processes/
│   │   │   │   │   └──  toolsnow.bpm <- process model
│   │   │   │   └── OperationalOntology.rdf <- ontology
├── frontend/
└── README.md
```

## Setup and Running

1. Clone this repository
2. Set up the backend:
    - Navigate to the `backend` directory
    - Run `./gradlew bootRun` to start the backend server
3. Set up the frontend:
    - Navigate to the `frontend` directory
    - Run `bun install` to install dependencies (or any other package manager)
    - Run `bun dev` to start the development server

## Prerequisites

- A recent Java Version (and Gradle)
- Bun (http://bun.sh) or npm/pnpm/yarn/... with node.js

## License

This project is licensed under the GNU GPLv3 License - see the LICENSE file for details.