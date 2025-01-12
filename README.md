# Configuration Management System

This project consists of two main services: a backend service built with Node.js/Express and a frontend service built with Vue.js. Each service has its own detailed documentation in their respective directories.

## Project Structure

- `backend/` - Node.js/Express backend service with Firebase Admin SDK
- `frontend/` - Vue.js frontend application

Each directory contains its own README file with detailed setup and running instructions.

## Environment Setup

Both services require their own `.env` file in their respective directories.

### Backend Environment Variables (`backend/.env`)

```plaintext
# Server Configuration
PORT=3000

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email

# API Token for Mobile Clients
API_TOKEN=api-token-for-mobile-clients
```

### Frontend Environment Variables (`frontend/.env`)

```plaintext
VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_auth_domain
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_storage_bucket
VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_APP_ID=your_app_id
VITE_MEASUREMENT_ID=your_measurement_id
VITE_API_BASE_URL=your_api_base_url #e.g. http://localhost:3000
```

## API Endpoints

- `GET /config/all` - Get all configurations (admin panel)
  - Requires Firebase authentication token

- `GET /config` - Get configuration parameters (mobile clients)
  - Requires API token
  - Optional query parameter: `country` (e.g., `/config?country=US`)

- `POST /config/add_config` - Create new configuration
  - Requires Firebase authentication token
  - Request body example:
    ```json
    {
      "key": "feature_flag",
      "value": true,
      "description": "Toggle feature X"
    }
    ```

- `PUT /config/update/:key` - Update configuration
  - Requires Firebase authentication token
  - Request body example:
    ```json
    {
      "value": false,
      "description": "Updated description",
      "countryOverrides": {
        "US": true,
        "UK": false
      }
    }
    ```

- `PUT /config/update/:key/country/:country` - Update country-specific override
  - Requires Firebase authentication token
  - Request body example:
    ```json
    {
      "value": true
    }
    ```

- `DELETE /config/delete/:key/country/:country` - Delete country-specific override
  - Requires Firebase authentication token
  - Example: `/config/delete/feature_flag/country/US`

- `DELETE /config/delete/:key` - Delete configuration
  - Requires Firebase authentication token
  - Example: `/config/delete/feature_flag`

- `GET /health` - Health check endpoint

For more detailed information about each service, please refer to their respective README files:
- Backend: [backend/README.md](backend/README.md)
- Frontend: [frontend/README.md](frontend/README.md)
