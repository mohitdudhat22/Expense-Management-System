# MERN Starter Template

This is a scalable and well-structured MERN stack starter template that includes essential features for web application development, such as user authentication, role-based access, and a clean code organization.

## Features

- User Authentication (Registration and Login)
- Role-Based Access Control (Admin and User roles)
- JWT Authentication
- Input Validation
- Centralized Error Handling
- API Documentation with Swagger
- Frontend with React and Vite
- State Management with Context API
- Protected Routes and Role-Based UI
- API Integration with Axios
- Styling with Tailwind CSS
- Testing with Jest and React Testing Library
- Deployment to Heroku and Vercel
- CI/CD with GitHub Actions

## Project Structure

### Backend

The backend is built using Node.js, Express, and MongoDB. It follows a modular approach with separate routes, controllers, and services.

#### Directory Structure

- `backend/`:
  - `config/`: Configuration files
  - `controllers/`: Route handlers
  - `models/`: MongoDB models
  - `routes/`: API routes
  - `services/`: Business logic
  - `utils/`: Helper functions
  - `index.js`: Entry point
  - `package.json`: Dependencies and scripts

#### Configuration

- `config/dbConnect.js`: Connects to MongoDB
- `config/constants.js`: Stores constants like database name

### Frontend

The frontend is built using React and Vite. It uses the Context API for state management and Axios for API requests.

#### Directory Structure

- `frontend/`:
  - `public/`: Static assets
  - `src/`:
    - `components/`: Reusable UI components
    - `context/`: Context API
    - `pages/`: Page components
    - `App.js`: Main application component
    - `index.js`: Entry point
    - `package.json`: Dependencies and scripts

#### Configuration

- `frontend/vite.config.js`: Vite configuration
- `frontend/public/index.html`: HTML template

### Deployment

#### Backend

- Deployed on Heroku
- Repository: [Backend](https://github.com/your-username/backend-repo)

#### Frontend

- Deployed on Vercel
- Repository: [Frontend](https://github.com/your-username/frontend-repo)

### CI/CD

- CI/CD with GitHub Actions

## Getting Started

### Backend

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

We welcome contributions to this project! Please read our [contributing guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.