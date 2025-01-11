# Deployment Instructions

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
   ```

   Replace the placeholders with your actual Firebase credentials.

3. Install dependencies:

   ```bash
   npm install
   ```

   or

   ```bash
   yarn install
   ```

4. Run the application in development mode:

   ```bash
   npm run dev
   ```

   or

   ```bash
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000` (or the port specified in your terminal).

## Testing

To test the application, ensure you have valid Firebase credentials in your `.env` file. You can sign in using the credentials you set up in your Firebase project.
