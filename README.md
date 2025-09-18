# Travel-Fest-Agent

A full-stack MERN (MongoDB, Express, React, Node.js) chatbot designed to provide personalized travel and festival recommendations. The application features a secure user authentication system with persistent chat history.

## Features

- **User Authentication**: Secure registration and login using JWT (JSON Web Tokens) and Bcrypt.js for password hashing.
- **Personalized Chatbot**: The chatbot's responses can be tailored based on the user's saved travel preferences and interests.
- **Persistent Chat History**: User conversations are stored in a MongoDB database, allowing them to log out and log back in to access their previous chats.
- **Real-time Email Validation**: The registration page provides immediate feedback if an email is already in use, improving user experience.

---

## Project Structure

The project is divided into two main components:

1.  **Backend**: A Node.js/Express server that handles API endpoints for user authentication, data storage, and the chatbot's logic.
2.  **Frontend**: A React application that provides the user interface for registration, login, and the chatbot.
3.  ---

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v14 or higher)
-   [npm](https://www.js.com/) or [yarn](https://yarnpkg.com/)
-   [MongoDB](https://www.mongodb.com/) account (local or cloud-based, like MongoDB Atlas)

### 1. Backend Setup

1.  Navigate to the `Backend` directory.
    ```bash
    cd Backend
    ```
2.  Install the required packages.
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `Backend` directory and add your MongoDB connection URI and a JWT secret key.
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key_for_jwt
    ```
4.  Start the backend server.
    ```bash
    node server.js
    ```
    The server will run on `http://localhost:5000`.

### 2. Frontend Setup

1.  Navigate to the `travel-chatbot-ui` directory.
    ```bash
    cd travel-chatbot-ui
    ```
2.  Install the required packages.
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `travel-chatbot-ui` directory to connect to your backend API.
    ```env
    REACT_APP_API_URL=http://localhost:5000
    ```
4.  Start the React development server.
    ```bash
    npm start
    ```
    The frontend will run on `http://localhost:3000` or a similar port.

---

## Usage

1.  **Register**: Navigate to the registration page (`/register`) to create a new user account. Fill out the form, including your name, email, and preferences. The application will validate your email in real-time.
2.  **Login**: Use your registered credentials to log in.
3.  **Chat**: Once logged in, you will be taken to the chatbot page. Your previous conversations will be loaded, and you can start a new chat.
4.  **Logout**: Log out of your account. When you log back in, your conversations will be accessible again.

---
