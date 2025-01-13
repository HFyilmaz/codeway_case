# Frontend Service Documentation

## Prerequisites

- Node.js
- npm or yarn

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. Create a `.env` file in the root of the `frontend` directory and add your Firebase configuration:

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

3. To obtain Firebase credentials:
   1. In Firebase Console, click the gear icon (⚙️) next to "Project Overview" and select "Project Settings"
   2. Scroll down to the "Your apps" section
   3. Find all required environment variables (except VITE_API_BASE_URL) under the configuration settings
   4. For VITE_API_BASE_URL, use your backend service URL (e.g., http://localhost:3000)

4. Install dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

5. Run the application in development mode:

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

## Testing

To test the application, ensure you have valid Firebase credentials in your `.env` file. You can sign in using the credentials you set up in your Firebase project.

## Functionality Overview

This application allows users to manage configuration parameters, including adding, updating, and deleting parameters. Users can also override configurations based on country codes. The application is built using Vue.js and utilizes Firebase for authentication and data storage.
