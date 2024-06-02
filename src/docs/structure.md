# Monitor Engine Structure

## Controllers and Services

### Handling Models

Rules:

- The one who produces/derives the data updates the model.
- Functions will assume the data they are given are up-to-date, it is their job to process it and derive other information from it.
