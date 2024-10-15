const app = require('./app');
const mongoose = require('mongoose');
const newman = require('newman');

// Start the server
const server = app.listen(5000, () => {
  console.log('Connected server at 5000');
});

// Helper function to stop the server
const stopServer = () => {
  server.close(() => {
    console.log('Server stopped after testing.');
    mongoose.disconnect();  // Disconnect from MongoDB
  });
};

// Test HR and Candidate APIs using Newman
const runNewmanTests = () => {
  const hrCollection = './postmanCollections/POC_Hr.postman_collection.json';
  const candidateCollection = './postmanCollections/POC_Candidate.postman_collection.json';
  
  console.log('Proceeding with Newman tests.');

  // Running Newman tests for HR API
  newman.run({
    collection: require(hrCollection),
    reporters: 'cli'
  }, (err, summary) => {
    if (err) { 
      console.error('Error running HR tests:', err);
    } else {
      console.log('Newman tests completed for HR:', hrCollection);
    }
    
    // Running Newman tests for Candidate API
    newman.run({
      collection: require(candidateCollection),
      reporters: 'cli'
    }, (err, summary) => {
      if (err) {
        console.error('Error running Candidate tests:', err);
      } else {
        console.log('Newman tests completed for Candidate:', candidateCollection);
      }
      stopServer();  // Stop the server after all tests
    });
  });
};

// Call the test runner
runNewmanTests();
