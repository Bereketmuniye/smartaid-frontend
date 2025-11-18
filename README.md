# SmartAid Frontend Application

This is the frontend application for the SmartAid NGO Project & Budget Management System, built with React.

## Table of Contents

- [Features](#features)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User Authentication (Login, Register)
- Dashboard overview
- NGO Management (Create, List, View)
- Project Management (Create, List, View, Activities, Budgets, Donors)
- Expense Tracking
- Reporting & Compliance (Placeholder)

## Folder Structure

The project follows a modular and scalable folder structure:

smartaid-frontend/
├── public/
├── src/
│ ├── assets/ # Static assets (images, fonts) and global styles
│ │ ├── images/
│ │ ├── fonts/
│ │ └── styles/
│ │ ├── base/ # Global variables, resets, typography
│ │ ├── components/ # Component-specific styles
│ │ └── layout/ # Layout-specific styles
│ ├── components/ # Reusable UI components
│ │ ├── common/ # Generic components (Button, Header, Footer)
│ │ ├── forms/ # Form elements (InputField, SelectField)
│ │ └── ui/ # Atomic UI elements (LoadingSpinner, Modals)
│ ├── config/ # Application-wide configurations (API base URL, constants)
│ ├── hooks/ # Custom React hooks for reusable logic (useAuth)
│ ├── layouts/ # Defines different page layouts (DefaultLayout)
│ ├── pages/ # Top-level components representing full views
│ │ ├── auth/ # Authentication pages (Login, Register)
│ │ ├── dashboard/ # Main dashboard view
│ │ ├── ngos/ # NGO related pages
│ │ ├── projects/ # Project related pages
│ │ └── users/ # User management pages
│ ├── services/ # Functions for interacting with the backend API
│ ├── store/ # State management (Redux slices, Context providers)
│ │ ├── reducers/ # Redux reducers
│ │ ├── actions/ # Redux actions
│ │ └── index.js # Redux store configuration
│ ├── utils/ # Utility functions (helpers, validators)
│ ├── App.js # Main application component, handles routing
│ └── index.js # Entry point of the React application
├── .env # Environment variables
├── package.json # Project dependencies and scripts
└── README.md # Project documentation
code
Code
## Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>/smartaid-frontend.git
    cd smartaid-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
    *(Note: If using SCSS, ensure `sass` is installed: `npm install sass`)*

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Configuration

### Environment Variables

Create a `.env` file in the root of the project to configure environment-specific variables.

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
# Add other environment variables here
Remember to restart the development server after changing .env variables.
API Endpoints
This frontend application interacts with the SmartAid backend API. Ensure your backend is running at the specified REACT_APP_API_BASE_URL.
Key endpoints used:
/api/users/register (POST)
/api/users/login (POST)
/api/users (GET)
/api/ngos (GET, POST)
/api/ngos/:id (GET)
/api/projects (GET, POST)
/api/projects/:id (GET)
etc. (Refer to the backend API documentation for a full list)
Contributing
Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us. (You might want to create a CONTRIBUTING.md file later.)
License
This project is licensed under the MIT License - see the LICENSE.md file for details. (You might want to create a LICENSE.md file later.)
code
Code
---

**Initial Steps to Get Started:**

1.  **Create the `smartaid-frontend` directory.**
2.  **Run `npx create-react-app .`** inside `smartaid-frontend` (the `.` tells it to create in the current directory).
3.  **Install `sass` and `react-router-dom` and `axios`:**
    ```bash
    npm install sass react-router-dom axios
    # or
    yarn add sass react-router-dom axios
    ```
    (If you use Redux, also install `@reduxjs/toolkit` and `react-redux`).
4.  **Create all the folders** as outlined in the structure.
5.  **Populate each file** with the content provided above.
6.  **Create the `.env` file** at the root.
7.  **Run `npm start`** to see your basic structure come alive!

This comprehensive setup gives you a solid, professional, and scalable foundation for your SmartAid frontend application!