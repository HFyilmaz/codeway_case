# Backend Service Documentation

This is the backend service for the Configuration Management System, built with Node.js and Express, using Firebase Admin SDK for authentication and data storage.

## Prerequisites

- Node.js
- npm or yarn
- Firebase Admin SDK credentials

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root of the `backend` directory with the following variables:
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

4. Set up Firebase Admin SDK:
   - Go to Firebase Console
   - Navigate to Project Settings > Service Accounts
   - Generate a new private key
   - Use the generated credentials in your `.env` file

## Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

### Production Mode
```bash
npm start
# or
yarn start
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

## Testing

Test API endpoints using Postman or curl:
   ```bash
   curl http://localhost:3000/health
   ```

## Functionality Overview

This backend service provides:
- Authentication using Firebase Admin SDK
- Configuration management API endpoints
- Country-specific configuration overrides **(BONUS)**