1. Backend Setup

# Navigate into the backend directory
cd backend

# Copy the example environment variables file
Copy-Item .env.example .env

# Install backend dependencies
npm install

# Push the schema to the SQLite database
npx prisma db push

# Generate the Prisma client
npx prisma generate

# Seed the database with the demo user and test data
npm run seed

# Start the backend development server (runs on port 5000)
npm run dev

2. Frontend Setup

# Navigate into the frontend directory
cd frontend

# Install frontend dependencies
npm install

# Start the frontend development server (runs on port 5173)
npm run dev
