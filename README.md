# Monitor Engine

## Architecture

Overview of file types:

- `config/`: Used for general configuration
- `controllers/`: Manage api logic
- `data/`: TBD
- `docs/`: Manages auto documentation, contains auto doc schemas
- `lib/`: Contains layer to use external services and apis
- `middleware/`: Manages code run as middleware in express
- `models/`: Data access layer for MongoDB & mongoose
- `network/`: Manages connection to the cluster, provides stable interface
- `routes/`: Defines the physical api routes that define the application
- `services/`: Contains the primary business logic
- `utils/`: Generic reusable code
- `validators`: TBD

### Logic and Data access flow

This is how data would be processed via the api:

(request) -> `Router` -> `Middleware` -> `Controller` -> `Service` -> `Data`

(response) <- `Controller` <- `Service` <- `Data`

