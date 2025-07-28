const mongoose = require('mongoose');

async function testMongoConnection() {
  console.log('=== MongoDB Connection Test ===');
  
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('❌ MONGODB_URI not set');
    return;
  }
  
  console.log('MongoDB URI format:', mongoUri.includes('mongodb+srv://') ? '✅ Valid' : '❌ Invalid');
  console.log('Attempting to connect...');
  
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log('Database name:', mongoose.connection.name);
    console.log('Connection state:', mongoose.connection.readyState);
    
    await mongoose.connection.close();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.log('❌ MongoDB connection failed:');
    console.log('Error:', error.message);
    console.log('Full error:', error);
  }
}

testMongoConnection(); 