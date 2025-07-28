// Simple environment variable test
console.log('=== Environment Variables Test ===');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET');
console.log('PORT:', process.env.PORT || 'NOT SET');
console.log('==============================='); 