# Render Deployment Setup Guide

## ✅ Build Status

The build is now successful! The application will start properly once you configure the environment variables.

## 🔧 Required Environment Variables

You need to set these environment variables in your Render dashboard:

### **Required Variables:**

1. **MONGODB_URI**

   - **Value**: Your MongoDB Atlas connection string
   - **Example**: `mongodb+srv://username:password@cluster.mongodb.net/ai-scheduling-app?retryWrites=true&w=majority`
   - **How to get**: Create a free MongoDB Atlas cluster at https://cloud.mongodb.com

2. **JWT_SECRET**

   - **Value**: A strong, random secret string
   - **Example**: `your-super-secret-jwt-key-here-make-it-long-and-random`
   - **How to generate**: Use a password generator or run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

3. **GEMINI_API_KEY**

   - **Value**: Your Google Gemini AI API key
   - **Example**: `AIzaSyC...` (starts with AIzaSy)
   - **How to get**: Visit https://makersuite.google.com/app/apikey

4. **NODE_ENV**
   - **Value**: `production`
   - **Purpose**: Sets the application to production mode

### **Optional Variables:**

5. **JWT_EXPIRES_IN**

   - **Value**: `7d` (default)
   - **Purpose**: JWT token expiration time

6. **RATE_LIMIT_WINDOW_MS**

   - **Value**: `900000` (default - 15 minutes)
   - **Purpose**: Rate limiting window

7. **RATE_LIMIT_MAX_REQUESTS**

   - **Value**: `100` (default)
   - **Purpose**: Maximum requests per window

8. **LOG_LEVEL**
   - **Value**: `info` (default)
   - **Purpose**: Logging level

## 🚀 How to Set Environment Variables in Render:

1. Go to your Render dashboard
2. Select your service
3. Go to "Environment" tab
4. Add each variable with its corresponding value
5. Click "Save Changes"
6. Redeploy your service

## 🔍 Troubleshooting:

### If the app still crashes:

1. Check the logs in Render dashboard
2. Verify all required environment variables are set
3. Ensure MongoDB Atlas cluster is accessible
4. Verify Gemini API key is valid

### Common Issues:

- **MongoDB Connection**: Make sure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0)
- **Gemini API**: Ensure your API key has the necessary permissions
- **JWT Secret**: Make sure it's a strong, random string

## 📝 Example Environment Variables Setup:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-scheduling-app?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-64-characters
GEMINI_API_KEY=AIzaSyC...your-actual-gemini-api-key
NODE_ENV=production
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

## ✅ After Setup:

Once you've set all the environment variables, your application should start successfully and be accessible at your Render URL!
