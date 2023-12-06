# express-mongo-jwt

### Stack

- express
- typescript
- jsonwebtoken
- mongoose
- bcrypt
- dotenv

### Instructions

- `yarn`
- Create a `.env` file with the MongoDB connection string `MONGODB_CONNECTION` & JWT secret `SECRET`
- `yarn dev`

### API Methods

- `GET /`: Test public method
- `POST /auth/register`: Register new user
  - `name`
  - `email`
  - `password`
  - `confirmPassword`
- `POST /auth/user`: Authenticate user
  - `email`
  - `password`
- `GET /user/:id`: (private) Get user info

### Middlewares

- `checkToken`: Check if Bearer token is valid
