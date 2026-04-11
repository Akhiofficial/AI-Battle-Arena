
import fetch from 'node-fetch';

async function testBattle() {
    try {
        const res = await fetch('http://localhost:3000/api/battle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ problem: "Write a simple hello world in JS" })
        });
        const data = await res.json();
        console.log("Response Status:", res.status);
        console.log("Response Data:", JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

testBattle();
