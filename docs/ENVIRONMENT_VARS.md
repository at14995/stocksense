# Environment Variables

To run the Stock Sense application locally, you need to create a `.env.local` file in the project root and populate it with the necessary Firebase configuration keys.

## Firebase Configuration

These variables are required for the application to connect to your Firebase project. You can get them from the Firebase console in your project's settings.

```
NEXT_PUBLIC_FIREBASE_API_KEY="AIza..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-ABCDEFGHIJ"
```

## Optional API Keys

These variables are for integrating with third-party services. The application can run without them, but certain features may be disabled.

- **`NEWS_API_KEY`**: An API key from a news provider (e.g., NewsAPI.org) used for sentiment analysis.
- **`SENDGRID_API_KEY`**: An API key for SendGrid, used to send email notifications for alerts and password resets.
- **`TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN`**: Credentials for Twilio, if SMS notifications are implemented.
