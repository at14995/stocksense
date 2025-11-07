# API Reference

This document provides a reference for the Firestore collections and Cloud Functions used in the Stock Sense application.

## Firebase Collections

- **`/users/{userId}`**
  - **Description**: Stores user profile data, preferences, and a reference to their roles.
  - **Schema**: `User`

- **`/watchlists/{watchlistId}`**
  - **Description**: Contains user-created watchlists.
  - **Schema**: `Watchlist` (`{ ownerUid, name, symbols[], public, updatedAt }`)

- **`/alerts/{alertId}`**
  - **Description**: Holds user-configured price alerts for specific stocks or cryptocurrencies.
  - **Schema**: `Alert` (`{ ownerUid, symbol, condition, target, status, notificationMethod }`)

- **`/posts/{postId}`**
  - **Description**: Stores posts created by analysts in the Analyst Hub.
  - **Schema**: `Post` (`{ ownerUid, username, content, tickers[], sentiment, likeCount, commentCount }`)
  
- **`/comments/{commentId}`**
  - **Description**: Stores comments on posts.
  - **Schema**: `Comment` (`{ postId, ownerUid, username, content }`)

- **`/tickets/{ticketId}`**
  - **Description**: Manages support tickets submitted by users.
  - **Schema**: `Ticket` (`{ ownerUid, subject, message, status, priority, lastActor }`)

- **`/notifications/{notificationId}`**
  - **Description**: Contains in-app notifications for users.
  -**Schema**: `Notification` (`{ uid, type, title, body, href, read }`)

- **`/roles/{userId}`**
  - **Description**: Defines user roles, such as 'admin' or 'analyst'.
  - **Schema**: `Role` (`{ role, isVerified, subscriptionActive }`)


## Cloud Functions (Conceptual)

While not implemented in this version, the following are conceptual Cloud Functions that would be required for full functionality:

- **`checkPriceTriggers`**: A scheduled function that runs periodically to check if any active alert conditions have been met.
- **`sendAlertNotification`**: Triggered when an alert's condition is met. Sends a notification to the user via their chosen method (email, app, etc.).
- **`updateSentimentCache`**: A function to periodically analyze news and social media sentiment for various stocks and update a cache, potentially in Firestore.
