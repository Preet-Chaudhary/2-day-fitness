## MongoDB Atlas Setup (Cloud Database)

### Step 1: Create Account
1. Go to: https://cloud.mongodb.com/
2. Sign up for free
3. Create a new project

### Step 2: Create Free Cluster
1. Click "Build a Database"
2. Choose "M0 Sandbox" (FREE)
3. Select your preferred region
4. Click "Create Cluster"

### Step 3: Setup Database Access
1. Go to "Database Access" in left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `admin`
5. Password: `password123` (or your choice)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Setup Network Access
1. Go to "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password

Example:
```
mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net/2day-fitness?retryWrites=true&w=majority
```

### Step 6: Update Your App
Update your `.env` file:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-long-and-random
MONGODB_URI=mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net/2day-fitness?retryWrites=true&w=majority
NODE_ENV=development
```

### Step 7: View Data in Atlas
1. In MongoDB Atlas, go to "Database"
2. Click "Browse Collections"
3. You'll see your `2day-fitness` database
4. Click on `users` collection to see all registered users
5. Data appears in real-time as users sign up!
