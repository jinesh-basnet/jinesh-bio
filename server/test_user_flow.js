const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

let userToken = '';
let userId = '';

async function testUserFlow() {
  console.log('=== Testing User Account Flow ===\n');

  try {
    console.log('1. Registering user "Test Test"');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      username: 'testtest',
      email: 'test@test.com',
      password: 'testpassword123'
    });
    console.log('Registration Response:', registerResponse.data);
    console.log('');

    console.log('2. Logging in as "Test Test"');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@test.com',
      password: 'testpassword123'
    });
    console.log('Login Response:', loginResponse.data);
    userToken = loginResponse.data.token;
    userId = loginResponse.data.user.id;
    console.log('');

    console.log('3. Getting user profile');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log('Profile Response:', profileResponse.data);
    console.log('');

    console.log('4. Deactivating account (as admin)');
    const adminLoginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'jinesh@admin.com',
      password: 'admin123'
    });
    const adminToken = adminLoginResponse.data.token;
    console.log('Admin login successful');

    const deactivateResponse = await axios.put(`${BASE_URL}/admin/users/${userId}`, {
      isActive: false
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('Deactivation Response:', deactivateResponse.data);
    console.log('');

    console.log('5. Attempting login with deactivated account');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'test@test.com',
        password: 'testpassword123'
      });
      console.log('ERROR: Login should have failed!');
    } catch (error) {
      console.log('Expected login failure:', error.response.data);
    }
    console.log('');

    console.log('6. Reactivating account');
    const reactivateResponse = await axios.put(`${BASE_URL}/admin/users/${userId}`, {
      isActive: true
    }, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('Reactivation Response:', reactivateResponse.data);
    console.log('');

    console.log('7. Logging in after reactivation');
    const loginAfterReactivation = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@test.com',
      password: 'testpassword123'
    });
    console.log('Login after reactivation:', loginAfterReactivation.data);
    console.log('');

    console.log('8. Deleting account');
    const deleteResponse = await axios.delete(`${BASE_URL}/admin/users/${userId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('Delete Response:', deleteResponse.data);
    console.log('');

    console.log('9. Attempting login with deleted account');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'test@test.com',
        password: 'testpassword123'
      });
      console.log('ERROR: Login should have failed!');
    } catch (error) {
      console.log('Expected login failure:', error.response.data);
    }
    console.log('');

  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

testUserFlow();
