const bcrypt = require('bcryptjs');

async function testPassword() {
  const storedHash = '$2b$12$nxfMil9.aecnr1Gbnp4Xn.sy38iLUVQSucPhpFI5S.3QATBnjrn86';
  const password = 'admin123';
  
  console.log('Testing password match...');
  console.log('Stored hash:', storedHash);
  console.log('Password to test:', password);
  
  const isMatch = await bcrypt.compare(password, storedHash);
  console.log('Password match result:', isMatch);
  
  // Also test creating a new hash
  const newHash = await bcrypt.hash(password, 12);
  console.log('New hash for same password:', newHash);
  
  const newMatch = await bcrypt.compare(password, newHash);
  console.log('New hash match result:', newMatch);
}

testPassword(); 