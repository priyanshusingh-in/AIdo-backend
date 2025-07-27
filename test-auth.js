// Test script for Authentication Endpoints
// Run this after starting the server

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testAuth() {
  console.log('🔐 Testing Authentication Endpoints\n');

  let authToken = '';

  try {
    // Test 1: Register a new user
    console.log('1. Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      email: 'test@example.com',
      password: 'TestPass123',
      firstName: 'John',
      lastName: 'Doe'
    });
    
    console.log('✅ User Registered Successfully');
    console.log('   User ID:', registerResponse.data.data.user.id);
    console.log('   Email:', registerResponse.data.data.user.email);
    console.log('   Token:', registerResponse.data.data.token.substring(0, 20) + '...');
    console.log('');

    authToken = registerResponse.data.data.token;

    // Test 2: Login with the same user
    console.log('2. Testing User Login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'TestPass123'
    });
    
    console.log('✅ User Logged In Successfully');
    console.log('   User ID:', loginResponse.data.data.user.id);
    console.log('   Email:', loginResponse.data.data.user.email);
    console.log('   Token:', loginResponse.data.data.token.substring(0, 20) + '...');
    console.log('');

    // Test 3: Get user profile (protected route)
    console.log('3. Testing Get Profile (Protected Route)...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('✅ Profile Retrieved Successfully');
    console.log('   User ID:', profileResponse.data.data._id);
    console.log('   Email:', profileResponse.data.data.email);
    console.log('   Name:', `${profileResponse.data.data.firstName} ${profileResponse.data.data.lastName}`);
    console.log('');

    // Test 4: Create a schedule with authentication
    console.log('4. Testing Schedule Creation with Authentication...');
    const scheduleResponse = await axios.post(`${BASE_URL}/schedules`, {
      prompt: "Schedule a meeting with the team tomorrow at 2 PM"
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('✅ Schedule Created Successfully');
    console.log('   Schedule ID:', scheduleResponse.data.data._id);
    console.log('   Title:', scheduleResponse.data.data.title);
    console.log('   Type:', scheduleResponse.data.data.type);
    console.log('   Date:', scheduleResponse.data.data.date);
    console.log('   Time:', scheduleResponse.data.data.time);
    console.log('');

    // Test 5: Get user's schedules (protected route)
    console.log('5. Testing Get User Schedules (Protected Route)...');
    const schedulesResponse = await axios.get(`${BASE_URL}/schedules`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('✅ User Schedules Retrieved Successfully');
    console.log('   Total Schedules:', schedulesResponse.data.data.length);
    console.log('   Message:', schedulesResponse.data.message);
    console.log('');

    // Test 6: Test invalid login
    console.log('6. Testing Invalid Login...');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'WrongPassword'
      });
    } catch (error) {
      console.log('✅ Invalid Login Handled Correctly');
      console.log('   Error:', error.response.data.error);
      console.log('');
    }

    // Test 7: Test accessing protected route without token
    console.log('7. Testing Protected Route Without Token...');
    try {
      await axios.get(`${BASE_URL}/auth/profile`);
    } catch (error) {
      console.log('✅ Unauthorized Access Handled Correctly');
      console.log('   Error:', error.response.data.error);
      console.log('');
    }

    console.log('🎉 All Authentication Tests Completed Successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the tests
testAuth(); 