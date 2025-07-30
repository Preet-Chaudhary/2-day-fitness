# MongoDB Setup for 2 Day Fitness App

## Option 1: Install MongoDB Locally (Recommended for Development)

### For Windows:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run as a Windows service automatically

### Start MongoDB (if not running as service):
```bash
# In a separate terminal, run:
mongod --dbpath="C:\data\db"
```

## Option 2: Use MongoDB Atlas (Cloud Database)

1. Go to https://cloud.mongodb.com/
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string
5. Update your `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/2day-fitness?retryWrites=true&w=majority
```

## Option 3: Use Docker (Alternative)

```bash
# Pull and run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Your connection string will be:
# MONGODB_URI=mongodb://localhost:27017/2day-fitness
```

## Environment Configuration

Update your `.env` file in the backend directory:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
MONGODB_URI=mongodb://localhost:27017/2day-fitness
NODE_ENV=development
```

## Verify Connection

After setting up MongoDB, restart your backend server:

```bash
cd "d:\Projects\2 day fitness\backend"
npm run dev
```

You should see:
- ✅ MongoDB Connected: localhost:27017
- 📊 Database: 2day-fitness

## Test the Database

1. Create a new user via the signup form
2. Check the database by visiting: http://localhost:5000/api/users
3. Your user data is now permanently stored in MongoDB!

## Database Collections

Your app will create these collections automatically:
- `users` - All registered users with encrypted passwords
- Indexes on email and createdAt for better performance

## Production Notes

- Change `JWT_SECRET` to a long, random string
- Use MongoDB Atlas or a dedicated database server
- Enable authentication and access controls
- Set up regular backups
