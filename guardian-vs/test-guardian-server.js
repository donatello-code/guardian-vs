// Standalone test script that starts the Guardian API Server and tests it
const { createGuardianApiServer } = require('./src/services/guardian/GuardianApiServer');

async function runTest() {
    console.log('Starting Guardian API Server on port 3001...');
    
    try {
        // Start the server
        const server = await createGuardianApiServer(3001);
        console.log('✅ Guardian API Server started successfully');
        
        // Give the server a moment to fully start
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Test the health endpoint
        console.log('\nTesting health endpoint...');
        const healthResponse = await fetch('http://localhost:3001/api/health');
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('✅ Health check passed:', JSON.stringify(healthData, null, 2));
        } else {
            console.log('❌ Health check failed:', healthResponse.status);
        }
        
        // Test the test endpoint
        console.log('\nTesting test endpoint...');
        const testResponse = await fetch('http://localhost:3001/api/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: 'What is 2+2?' })
        });
        if (testResponse.ok) {
            const testData = await testResponse.json();
            console.log('✅ Test endpoint passed:', JSON.stringify(testData, null, 2));
        } else {
            console.log('❌ Test endpoint failed:', testResponse.status);
        }
        
        // Test the chat endpoint
        console.log('\nTesting chat endpoint...');
        const chatResponse = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: 'Write a simple hello world program in JavaScript.' }
                ],
                model: 'guardian-chat',
                temperature: 0.7,
                max_tokens: 500
            })
        });
        if (chatResponse.ok) {
            const chatData = await chatResponse.json();
            console.log('✅ Chat endpoint passed');
            console.log('Response content:', chatData.choices?.[0]?.message?.content?.substring(0, 100) + '...');
        } else {
            console.log('❌ Chat endpoint failed:', chatResponse.status);
        }
        
        // Stop the server
        console.log('\nStopping Guardian API Server...');
        await server.stop();
        console.log('✅ Guardian API Server stopped');
        
    } catch (error) {
        console.error('❌ Error during test:', error);
        process.exit(1);
    }
}

// Run the test
runTest().catch(console.error);