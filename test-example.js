// Simple test script to demonstrate the AI Scheduling Backend API
// Run this after starting the server

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testAPI() {
  console.log('🚀 Testing AI Scheduling Backend API\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL.replace('/api/v1', '')}/health`);
    console.log('✅ Health Check:', healthResponse.data.message);
    console.log('   Database Status:', healthResponse.data.database);
    console.log('');

    // Test 2: Create a meeting schedule
    console.log('2. Creating a meeting schedule...');
    const meetingResponse = await axios.post(`${BASE_URL}/schedules`, {
      prompt: "Schedule a meeting with John next Tuesday at 10 AM for 1 hour",
      userId: "user123"
    });
    console.log('✅ Meeting Created:', meetingResponse.data.data.title);
    console.log('   Type:', meetingResponse.data.data.type);
    console.log('   Date:', meetingResponse.data.data.date);
    console.log('   Time:', meetingResponse.data.data.time);
    console.log('   Participants:', meetingResponse.data.data.participants);
    console.log('');

    // Test 3: Create a reminder
    console.log('3. Creating a reminder...');
    const reminderResponse = await axios.post(`${BASE_URL}/schedules`, {
      prompt: "Remind me to call Sarah tomorrow at 3 PM",
      userId: "user123"
    });
    console.log('✅ Reminder Created:', reminderResponse.data.data.title);
    console.log('   Type:', reminderResponse.data.data.type);
    console.log('   Date:', reminderResponse.data.data.date);
    console.log('   Time:', reminderResponse.data.data.time);
    console.log('');

    // Test 4: Create a task
    console.log('4. Creating a task...');
    const taskResponse = await axios.post(`${BASE_URL}/schedules`, {
      prompt: "Add a task to review quarterly reports by Friday at 5 PM",
      userId: "user123"
    });
    console.log('✅ Task Created:', taskResponse.data.data.title);
    console.log('   Type:', taskResponse.data.data.type);
    console.log('   Date:', taskResponse.data.data.date);
    console.log('   Time:', taskResponse.data.data.time);
    console.log('');

    // Test 5: Get all schedules
    console.log('5. Fetching all schedules...');
    const schedulesResponse = await axios.get(`${BASE_URL}/schedules?userId=user123`);
    console.log('✅ Schedules Retrieved:', schedulesResponse.data.data.length, 'schedules found');
    schedulesResponse.data.data.forEach((schedule, index) => {
      console.log(`   ${index + 1}. ${schedule.title} (${schedule.type}) - ${schedule.date} at ${schedule.time}`);
    });
    console.log('');

    // Test 6: Get schedules by type
    console.log('6. Fetching meetings only...');
    const meetingsResponse = await axios.get(`${BASE_URL}/schedules/type/meeting?userId=user123`);
    console.log('✅ Meetings Retrieved:', meetingsResponse.data.data.length, 'meetings found');
    console.log('');

    // Test 7: Get schedules by date range
    console.log('7. Fetching schedules by date range...');
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dateRangeResponse = await axios.get(`${BASE_URL}/schedules/date-range?startDate=${today}&endDate=${nextWeek}&userId=user123`);
    console.log('✅ Date Range Retrieved:', dateRangeResponse.data.data.length, 'schedules in range');
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Health check: ✅');
    console.log('   - Meeting creation: ✅');
    console.log('   - Reminder creation: ✅');
    console.log('   - Task creation: ✅');
    console.log('   - Schedule retrieval: ✅');
    console.log('   - Type filtering: ✅');
    console.log('   - Date range filtering: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure the server is running on http://localhost:3000');
    console.log('   Run: npm run dev');
  }
}

// Run the test
testAPI(); 