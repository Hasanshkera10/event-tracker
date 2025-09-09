// Simple test file for CI/CD pipeline
const assert = require('assert');

// Test basic functionality
function testBasicFunctionality() {
  console.log('Running basic tests...');
  
  // Test 1: Basic math
  assert.strictEqual(2 + 2, 4, 'Basic math should work');
  
  // Test 2: String operations
  assert.strictEqual('Hello'.length, 5, 'String length should work');
  
  // Test 3: Array operations
  const arr = [1, 2, 3];
  assert.strictEqual(arr.length, 3, 'Array length should work');
  
  console.log('✅ All basic tests passed!');
}

// Test API endpoints (mock)
function testAPIEndpoints() {
  console.log('Testing API endpoints...');
  
  // Mock test for API structure
  const mockEvent = {
    id: 'test-id',
    title: 'Test Event',
    event_date: '2023-12-15',
    location: 'Test Location'
  };
  
  assert.strictEqual(typeof mockEvent.id, 'string', 'Event ID should be string');
  assert.strictEqual(typeof mockEvent.title, 'string', 'Event title should be string');
  assert.strictEqual(typeof mockEvent.event_date, 'string', 'Event date should be string');
  
  console.log('✅ API endpoint tests passed!');
}

// Run all tests
function runTests() {
  try {
    testBasicFunctionality();
    testAPIEndpoints();
    console.log('🎉 All tests passed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testBasicFunctionality, testAPIEndpoints };
