# Products API

This is a robust and scalable RESTful API for managing products and orders, built with Node.js, Express, TypeScript, and Sequelize. It follows a clean architecture pattern, emphasizing separation of concerns and maintainability.

## Features

- **Product Management**: CRUD operations for products (create, read, update, delete).
- **Order Management**: Create, retrieve, update, and delete orders. Includes stock management and order status updates.
- **User Authentication (Placeholder)**: Designed to integrate with user authentication (though not fully implemented in this version).
- **Database Integration**: Uses Sequelize ORM for interacting with a relational database (SQLite by default).
- **Dependency Injection**: Implemented with InversifyJS for better testability and modularity.
- **Logging**: Integrated with Log4js for structured logging.
- **Error Handling**: Centralized error handling with custom `AppError` class.
- **Validation**: Request validation using Joi schemas.
- **Swagger Documentation**: Automatically generated API documentation.
- **Unit Testing**: Comprehensive unit tests for service logic using Jest.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Fast, unopinionated, minimalist web framework.
- **TypeScript**: Superset of JavaScript that adds static types.
- **Sequelize**: Promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server.
- **InversifyJS**: A powerful and lightweight inversion of control container for TypeScript & JavaScript apps.
- **Jest**: Delightful JavaScript Testing Framework.
- **Joi**: Object schema description language and validator for JavaScript.
- **Swagger-UI-Express**: Middleware to serve Swagger UI.
- **Log4js**: A flexible logging library for Node.js.

## Project Structure

The project follows a clean architecture, separating concerns into distinct layers:

```
.
├── src/
│   ├── config.ts           # Configuration file
│   ├── constants/          # Application-wide constants (e.g., error codes)
│   ├── controllers/        # Handles incoming requests and sends responses
│   ├── database/           # Database connection and initialization
│   ├── dtos/               # Data Transfer Objects (request/response schemas)
│   ├── interfaces/         # TypeScript interfaces for contracts
│   ├── middlewares/        # Express middleware (e.g., error handling, validation)
│   ├── models/             # Sequelize models (database schemas)
│   ├── repositories/       # Data access layer (interacts with models)
│   ├── services/           # Business logic layer (core application logic)
│   ├── utils/              # Utility functions (e.g., custom error, logger)
│   ├── index.ts            # Main application entry point
│   ├── inversify.config.ts # InversifyJS dependency injection setup
│   ├── module-alias.ts     # Module alias setup
│   ├── swagger.ts          # Swagger documentation setup
│   ├── types/              # Custom type definitions
│   └── __tests__/          # Root directory for all unit tests
├── Dockerfile              # Dockerization for deployment
├── jest.config.js          # Jest test runner configuration
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript compiler configuration
└── README.md               # Project documentation (this file)
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager) or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/products-api.git
   cd products-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Variables:**
   Create a `.env` file in the root directory by copying `.env.example` and filling in the necessary values.

   ```bash
   cp .env.example .env
   ```

   Example `.env` content:
   ```
   PORT=3000
   NODE_ENV=development
   DATABASE_STORAGE=./database.sqlite
   DATABASE_LOGGING=true
   DATABASE_FORCE_SYNC=false
   LOG_LEVEL=debug
   ```

4. **Database Setup:**
   The project uses SQLite by default, which is file-based and requires no additional setup. A `database.sqlite` file will be created in the root directory upon first run or seeding.

   To seed the database with initial data:
   ```bash
   npm run seed
   ```

### Running the Application

To start the development server with hot-reloading:

```bash
npm run dev
```

The API will be accessible at `http://localhost:3000`.

### API Documentation (Swagger)

Once the server is running, you can access the API documentation at:

`http://localhost:3000/api-docs`

## Running Tests

To run all unit tests:

```bash
npm test
```

To run tests for a specific service (e.g., ProductService):

```bash
npm test src/services/__tests__/ProductService.test.ts
```

## Docker

To build and run the application using Docker:

1. **Build the Docker image:**
   ```bash
   docker build -t products-api .
   ```

2. **Run the Docker container:**
   ```bash
   docker run -p 3000:3000 products-api
   ```

The API will be accessible at `http://localhost:3000` from your host machine.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

[Specify your license here, e.g., MIT License]
