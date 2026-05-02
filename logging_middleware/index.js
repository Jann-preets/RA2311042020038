const axios = require('axios');

/**
 * Reusable Logging Function for Affordmed Test Server
 */
async function Log(stack, level, pkg, message, token) {
    const LOG_API = 'http://20.207.122.201/evaluation-service/logs';
    
    const payload = {
        stack: stack.toLowerCase(),    
        level: level.toLowerCase(),    
        package: pkg.toLowerCase(),    
        message: message
    };

    try {
        await axios.post(LOG_API, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });
    } catch (error) {
        console.error("Local Logging Error:", error.message);
    }
}

module.exports = { Log };