function formatTimestamp(isoString) {
    const date = new Date(isoString);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[date.getDay()];

    const dayNum = date.getDate();
    const month = date.getMonth() + 1; // zero-based

    const pad = n => n.toString().padStart(2, '0');
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    // Format: Tue 30/05 14:35:12
    return `${dayName} ${pad(dayNum)}/${pad(month)} ${hours}:${minutes}:${seconds}`;
}

async function fetchLatestData() {
    try {
        const response = await fetch('http://localhost:5000/sensor_data?room_id=bedroom&limit=20');
        if (!response.ok) throw new Error('Network response not ok');

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            document.getElementById('sensor-data').textContent = 'No data found';
            return;
        }

        data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const latest = data[0];

        document.getElementById('sensor-data').innerHTML = `
            <p>🌡️ <strong>Temperature:</strong> ${latest.temperature} °C</p>
            <p>💧 <strong>Humidity:</strong> ${latest.humidity} %</p>
            <p class="timestamp">🕑 ${formatTimestamp(latest.timestamp)}</p>
        `;
    } catch (error) {
        document.getElementById('sensor-data').textContent = 'Error fetching data: ' + error.message;
    }
}

fetchLatestData();

