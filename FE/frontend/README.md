# SaaS WMS Frontend

This is the frontend application for the SaaS Warehouse Management System (WMS). It's built with React, TypeScript, and Ant Design.

## Features

- User authentication with MFA support
- Registration with form validation
- Responsive design with beautiful UI
- Multi-language support (English and Vietnamese)
- API proxy configuration for local and server environments
- State management with Zustand
- React Router for navigation

## Pages

- **Home Page**: Landing page with information about the WMS system
- **Login Page**: User authentication with MFA support
- **Register Page**: User registration with form validation
- **MFA Page**: Two-factor authentication with OTP verification
- **Dashboard Page**: Main application dashboard

## Technology Stack

- **React 19**: UI library
- **TypeScript**: Type safety
- **Ant Design**: UI component library
- **React Router**: Navigation
- **Zustand**: State management
- **Axios**: HTTP client
- **React i18next**: Internationalization
- **Vite**: Build tool

## Project Structure

```
src/
├── api/           # API configuration
├── components/    # Reusable UI components
├── i18n/         # Internationalization files
├── pages/         # Page components
├── services/      # Business logic and API calls
├── stores/       # Zustand state management
├── utils/        # Utility functions
├── App.css       # Global styles
├── App.tsx       # Main application component with routing
└── main.tsx      # Application entry point
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

## Configuration

### Path Aliases

The project uses `@` as an alias for the `src` directory, configured in both TypeScript and Vite.

### API Configuration

The application supports switching between local and server APIs through the UI. This is managed by the `proxyConfig` utility.

### Internationalization

The application supports English (en) and Vietnamese (vi) languages, managed by react-i18next.

## Components

### LoginPage

Handles user authentication with the following features:
- Username/email and password inputs
- API target selection (local/server)
- Remember me option
- Demo account quick login
- MFA redirection
- Password recovery link

### RegisterPage

Handles user registration with the following features:
- Form validation for all fields
- Password confirmation
- Terms of service acceptance
- API target selection
- Navigation to login page

### MfaPage

Handles two-factor authentication with the following features:
- 6-digit OTP input
- Code resend functionality
- Navigation to dashboard upon success

### DashboardPage

Simple dashboard page with:
- Sidebar navigation
- User information display
- Logout functionality

### HomePage

Landing page showcasing:
- Feature highlights
- Benefits of the system
- Call-to-action buttons
- Responsive design

## Authentication Flow

1. Users can access the Login or Register pages
2. After successful login, if MFA is enabled, users are redirected to the MFA page
3. Upon successful verification, users are redirected to the Dashboard
4. Authenticated users are automatically redirected to the Dashboard if they try to access login/register pages
5. Authentication state is persisted using Zustand with localStorage

## Deployment

The application is configured to be deployed as a static site. Ensure the server is configured to handle client-side routing properly.

## Contributing

When contributing to this project:
- Follow the existing code style
- Use TypeScript for type safety
- Create components that are reusable
- Ensure responsive design
- Add appropriate error handling
- Update internationalization files for new text content