Architecture summary

This Spring Boot architecture functions as a hybrid system that integrates both server-side rendering and decoupled API services. The application manages user interactions through two distinct entry points: Thymeleaf Controllers, which render the Admin and Doctor dashboards, and REST Controllers, which handle JSON-based communication for external modules.

Central to the application's design is a unified Service Layer. Regardless of the controller type used, all business logic is processed here before being delegated to the persistence layer. This layer coordinates data flow between two different database technologies to suit specific storage needs.

Relational data—comprising patients, doctors, appointments, and administrative records—is managed via MySQL Repositories using JPA Entities. Simultaneously, the system handles medical prescriptions as Document Models through a MongoDB Repository. This dual-database approach allows the application to maintain strict relational integrity for core user data while benefiting from the flexible, document-oriented nature of MongoDB for clinical records.


Numbered flow of data and control

1.User Request Initialization: Users interact with the frontend through Dashboards (Admin/Doctor) or REST Modules.
2.Controller Entry Point: Requests are routed to Thymeleaf Controllers for web views or REST Controllers for API responses.
3.Service Layer Logic: The controllers call the Service Layer to process core business logic.
4.Repository Communication: The Service Layer sends data requests to either MySQL Repositories or MongoDB Repositories.
5.Database Access: Repositories interact directly with the physical MySQL Database or MongoDB Database.
6.Entity Mapping: Retrieved data is mapped to JPA Entities (like Patient or Doctor) or MongoDB Documents (like Prescription).
7.Response Delivery: The final data models are sent back up to the controllers to be displayed on the user's dashboard or returned via JSON.
