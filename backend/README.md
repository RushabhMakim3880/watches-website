# TM WATCH Backend API

Complete MySQL database backend with Node.js/Express REST API for the TM WATCH e-commerce website.

## Features

- ✅ User authentication (JWT)
- ✅ Product management
- ✅ Shopping cart
- ✅ Wishlist
- ✅ Order processing
- ✅ Newsletter subscriptions
- ✅ MySQL database with 8 tables
- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

### 1. Install MySQL

Download and install MySQL from [mysql.com](https://dev.mysql.com/downloads/mysql/)

### 2. Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE tmwatch_db;
EXIT;
```

### 3. Import Schema

```bash
cd backend
mysql -u root -p tmwatch_db < database/schema.sql
```

### 4. Import Seed Data (Optional)

```bash
mysql -u root -p tmwatch_db < database/seed.sql
```

### 5. Install Dependencies

```bash
npm install
```

### 6. Configure Environment

Edit `.env` file and update:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tmwatch_db
JWT_SECRET=your_random_secret_key
PORT=3000
FRONTEND_URL=http://localhost:8000
```

**IMPORTANT:** Change `JWT_SECRET` to a random string!

### 7. Start Server

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/:id` | Get single product | No |
| POST | `/api/products` | Create product | Yes |
| PUT | `/api/products/:id` | Update product | Yes |
| DELETE | `/api/products/:id` | Delete product | Yes |

### Cart

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart` | Get user cart | Yes |
| POST | `/api/cart` | Add to cart | Yes |
| PUT | `/api/cart/:id` | Update cart item | Yes |
| DELETE | `/api/cart/:id` | Remove from cart | Yes |
| DELETE | `/api/cart` | Clear cart | Yes |

### Wishlist

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/wishlist` | Get wishlist | Yes |
| POST | `/api/wishlist` | Add to wishlist | Yes |
| DELETE | `/api/wishlist/:id` | Remove from wishlist | Yes |

### Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/orders` | Create order | Yes |
| GET | `/api/orders` | Get user orders | Yes |
| GET | `/api/orders/:id` | Get order details | Yes |

### Newsletter

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/newsletter` | Subscribe | No |
| GET | `/api/newsletter` | Get subscribers | No |

## Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Register

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91-9876543210",
  "address": "Mumbai, India"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Using Token

Include the token in the Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Testing with Postman

1. Import the API endpoints into Postman
2. Register a new user
3. Copy the token from the response
4. Add token to Authorization header for protected routes

## Database Schema

- **users** - User accounts
- **products** - Watch products
- **orders** - Customer orders
- **order_items** - Order line items
- **cart** - Shopping cart items
- **wishlist** - Wishlist items
- **newsletter** - Newsletter subscribers
- **contact_messages** - Contact form submissions

## Error Handling

All endpoints return JSON responses:

Success:
```json
{
  "success": true,
  "data": {...}
}
```

Error:
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire after 24 hours
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- CORS enabled for frontend

## Troubleshooting

### Database Connection Failed

- Make sure MySQL is running
- Check credentials in `.env` file
- Verify database exists: `SHOW DATABASES;`

### Port Already in Use

Change PORT in `.env` file to a different port (e.g., 3001)

### Token Invalid

- Token may have expired (24 hours)
- Login again to get a new token

## Development

```bash
# Install nodemon for auto-restart
npm install -g nodemon

# Run in development mode
npm run dev
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2
3. Enable HTTPS
4. Use environment variables for secrets
5. Set up database backups
6. Enable rate limiting

## License

ISC
