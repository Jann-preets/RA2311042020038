const axios = require('axios');

const API_URL = 'http://202.107.122.201/evaluation-service/notifications';

const PRIORITY_WEIGHTS = {
    'Placement': 3,
    'Result': 2,
    'Event': 1
};

async function getPriorityInbox() {
    try {
        console.log("Fetching notifications...");
        const response = await axios.get(API_URL, { timeout: 5000 });
        const rawLogs = response.data.notifications;
        processAndDisplay(rawLogs);
    } catch (error) {
        console.log("External API unreachable. Using local evaluation data for Stage 1 demo...");
        // This sample data matches the exact format in your screenshots
        const mockData = [
            { "ID": "1", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:51:30" },
            { "ID": "2", "Type": "Placement", "Message": "CSX Corp hiring", "Timestamp": "2026-04-22 17:51:18" },
            { "ID": "3", "Type": "Event", "Message": "farewell", "Timestamp": "2026-04-22 17:51:06" },
            { "ID": "4", "Type": "Placement", "Message": "AMD hiring", "Timestamp": "2026-04-22 17:49:42" },
            { "ID": "5", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:42" }
        ];
        processAndDisplay(mockData);
    }
}

function processAndDisplay(data) {
    const sortedNotifs = data.sort((a, b) => {
        const weightA = PRIORITY_WEIGHTS[a.Type] || 0;
        const weightB = PRIORITY_WEIGHTS[b.Type] || 0;
        if (weightB !== weightA) return weightB - weightA;
        return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    const top10 = sortedNotifs.slice(0, 10);
    console.log("\n--- Stage 1: Priority Inbox (Top 10) ---");
    console.table(top10);
}

getPriorityInbox();