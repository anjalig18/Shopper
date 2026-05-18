const http = require('http');

const testAdminAPI = () => {
  const postData = JSON.stringify({
    email: 'admin@example.com',
    password: 'admin123'
  });

  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/admin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log('🌐 Testing admin login API endpoint...');
  console.log('Sending request to:', `http://${options.hostname}:${options.port}${options.path}`);
  console.log('Request data:', postData);

  const req = http.request(options, (res) => {
    console.log('Response status:', res.statusCode);
    console.log('Response headers:', res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Response body:', data);
      
      try {
        const jsonData = JSON.parse(data);
        if (res.statusCode === 200) {
          console.log('✅ Admin login API test successful!');
          console.log('User data:', jsonData.user);
        } else {
          console.log('❌ Admin login API test failed');
          console.log('Error:', jsonData.message);
        }
      } catch (error) {
        console.log('❌ Error parsing response:', error.message);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
  });

  req.write(postData);
  req.end();
};

testAdminAPI(); 