# BookReviewApp

A cross-platform mobile application for book lovers to discover, review, and share their favorite books.

## Features

- User Authentication (Sign up/Sign in)
- Book Search using Google Books API
- Book Details with Description
- Reviews and Ratings
- Personal Reading Lists
- Social Features (Following users, sharing reviews)

## Tech Stack

- React Native
- TypeScript
- Firebase Authentication
- Cloud Firestore
- Google Books API
- React Navigation
- Node.js & Express
- MongoDB

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- React Native development environment set up
- Firebase account and project

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd BookReviewApp
```

2. Install dependencies
```bash
npm install
```

3. Set up Firebase
   - Create a new Firebase project
   - Add iOS and Android apps in Firebase console
   - Download and add the configuration files
   - Enable Authentication and Firestore

4. Run the app
```bash
# iOS
npx pod-install ios
npx react-native run-ios

# Android
npx react-native run-android
```

## Backend server (optional)

The `backend/` directory contains a simple Node.js/Express service for
persisting book reviews. Start it separately if you want to use the REST API.

```bash
cd backend
npm install
npm start
```

Ensure `MONGODB_URI` is set in your environment to point to your MongoDB
instance.

## Project Structure

```
src/
├── config/      # Firebase and other configuration
├── navigation/  # Application navigation setup
└── screens/     # Screen components
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
