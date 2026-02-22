// Test script for Guardian API Server
// Run with: node test-guardian-api.js

const http = require('http');

async function testGuardianApi() {
    console.log('Testing Guardian API Server...\n');
    
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    try {
        const healthResponse = await makeRequest('GET', '/api/health');
        console.log('✓ Health check passed:', JSON.stringify(healthResponse, null, 2));
    } catch (error) {
        console.log('✗ Health check failed:', error.message);
        console.log('Make sure the Guardian API Server is running on port 3001');
        console.log('Start it with: createGuardianApiServer() from GuardianApiServer.ts');
        return;
    }
    
    // Test 2: Test endpoint
    console.log('\n2. Testing test endpoint...');
    try {
        const testResponse = await makeRequest('POST', '/api/test', {
            prompt: 'What is 2+2?'
        });
        console.log('✓ Test endpoint passed:', JSON.stringify(testResponse, null, 2));
    } catch (error) {
        console.log('✗ Test endpoint failed:', error.message);
    }
    
    // Test 3: Chat endpoint
    console.log('\n3. Testing chat endpoint...');
    try {
        const chatResponse = await makeRequest('POST', '/api/chat', {
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant.'
                },
                {
                    role: 'user',
                    content: 'Write a simple hello world program in JavaScript.'
                }
            ],
            model: 'guardian-chat',
            temperature: 0.7,
            max_tokens: 500
        });
        console.log('✓ Chat endpoint passed');
        console.log('Response content:', chatResponse.choices?.[0]?.message?.content?.substring(0, 100) + '...');
    } catch (error) {
        console.log('✗ Chat endpoint failed:', error.message);
    }
    
    console.log('\n✅ Guardian API Server test completed!');
}

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        const req = http.request(options, (res) => {
            let body = '';
            
            res.on('data', (chunk) => {
                body += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(body));
                    } catch (error) {
                        resolve(body);
                    }
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${body}`));
                }
            });
        });
        
        req.on('error', (error) => {
            reject(error);
        });
        
        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// Run the test
testGuardianApi().catch(console.error);