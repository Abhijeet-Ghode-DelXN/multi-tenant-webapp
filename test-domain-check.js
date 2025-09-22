// Test script to check domain identification
const testDomainExtraction = () => {
  // Simulate different domains
  const testCases = [
    'isaac-gomes-ernandes:3000',
    'localhost:3000',
    'www.landscape360.com',
    'isaac-gomes-ernandes.localhost:3000'
  ];

  testCases.forEach(host => {
    console.log(`Testing: ${host}`);
    
    // New domain-based logic
    const domain = host.split(':')[0];
    let tenant = null;
    
    if (domain === 'localhost' || domain === '127.0.0.1') {
      tenant = null; // Superadmin mode
    } else if (domain === 'www.landscape360.com' || domain === 'landscape360.com') {
      tenant = null; // Superadmin mode
    } else {
      tenant = domain; // Tenant domain
    }
    
    console.log(`  Domain: ${domain}, Tenant: ${tenant}, Mode: ${tenant ? 'Tenant' : 'Superadmin'}`);
    console.log('---');
  });
};

testDomainExtraction();