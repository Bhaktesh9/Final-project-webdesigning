# Inventory Management Web App

A complete inventory management system built with Node.js, Express.js, Supabase, and vanilla JavaScript.

## Features

- **User Authentication**: JWT-based login/signup system
- **Role-Based Access Control**: 4 user roles with different permissions
- **Inventory Management**: Track sales and purchases
- **Admin Panel**: User approval and system oversight with responsive 3-panel layout
- **Responsive Design**: Clean, modern UI with mobile-first approach
- **Containerization**: Docker support

## User Roles

- **Admin**: Can approve users, view all sales & purchases, manage system
- **Manager**: Can view sales & purchase reports  
- **Salesman**: Can only record sales transactions
- **PurchaseMan**: Can only record purchase transactions

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT tokens, bcryptjs password hashing
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Environment**: dotenv for configuration
- **Containerization**: Docker

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Final\ Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a Supabase project at https://supabase.com
   - Create the required tables (users, sales, purchases) in your Supabase SQL Editor
   - Get your project URL and API key from Settings → API

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   PORT=3000
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   JWT_SECRET=your-super-secret-jwt-key
   ```

5. **Load sample data (optional)**
   ```bash
   npm run seed
   ```

6. **Run the application**
   ```bash
   npm start
   ```

7. **Access the application**
   Open http://localhost:3000 in your browser

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/pending-users` - Get pending users (Admin only)
- `POST /api/auth/approve` - Approve user (Admin only)
- `GET /api/auth/users` - Get all users (Admin only)

### Inventory
- `POST /api/inventory/sales` - Record sale (Salesman, Admin)
- `GET /api/inventory/sales` - View sales (Manager, Admin)
- `POST /api/inventory/purchases` - Record purchase (PurchaseMan, Admin)
- `GET /api/inventory/purchases` - View purchases (Manager, Admin)

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'Admin', 'Manager', 'Salesman', 'PurchaseMan'
  status VARCHAR(20) DEFAULT 'pending', -- 'active', 'pending'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Sales Table
```sql
CREATE TABLE sales (
  id UUID PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  salesman_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Purchases Table
```sql
CREATE TABLE purchases (
  id UUID PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  purchaseman_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Development

For development with auto-restart:
```bash
npm run dev
```

## Docker

Build and run with Docker:
```bash
docker build -t inventory-app .
docker run -p 3000:3000 inventory-app
```

## Usage

1. **Sign up** for a new account (requires admin approval)
2. **Admin** must approve new users before they can access the system
3. **Salesman** can record sales transactions
4. **PurchaseMan** can record purchase transactions  
5. **Manager** can view sales and purchase reports
6. **Admin** has full system access

## Project Structure

```
src/
├── middleware/
│   └── requireAuth.js      # JWT authentication middleware
├── public/
│   ├── app.js             # Frontend JavaScript
│   ├── index.html         # Main HTML page
│   └── style.css          # Responsive styles
├── routes/
│   ├── auth.js            # Authentication routes
│   └── inventory.js       # Inventory management routes
├── utils/
│   ├── db.js              # Database models and connection
│   └── password.js        # Password utilities
├── server.js              # Main server file
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── Dockerfile             # Docker configuration
├── seed.js                # Database seed file
└── package.json           # Project dependencies
```

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based authorization
- Input validation
- Environment variable configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.