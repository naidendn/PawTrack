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
        const response = await fetch('http://127.0.0.1:5000/sensor_data?room_id=bedroom&limit=20');
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

async function fetchHistoricalData(roomId = 'bedroom', limit = 20) {
  const url = `http://127.0.0.1:5000/sensor_data?room_id=${roomId}&limit=${limit}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching historical data:', err);
    return [];
  }
}

function createChart(labels, tempData, humidityData) {
  const ctx = document.getElementById('sensorChart').getContext('2d');

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels, // timestamps
      datasets: [
        {
          label: 'Temperature (°C)',
          data: tempData,
          borderColor: 'rgba(79, 195, 247, 1)',
          backgroundColor: 'rgba(79, 195, 247, 0.2)',
          fill: true,
          tension: 0.3,
        },
        {
          label: 'Humidity (%)',
          data: humidityData,
          borderColor: 'rgba(38, 198, 218, 1)',
          backgroundColor: 'rgba(38, 198, 218, 0.2)',
          fill: true,
          tension: 0.3,
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      plugins: {
        legend: { labels: { color: '#e0e0e0' } },
      },
      scales: {
        x: {
          ticks: { color: '#bbb' }
        },
        y: {
          ticks: { color: '#bbb' },
          beginAtZero: true
        }
      }
    }
  });
}

async function initChart() {
  const data = await fetchHistoricalData();
  if (data.length === 0) {
    document.getElementById('chart-container').innerHTML = '<p>No data to display</p>';
    return;
  }

  const labels = data.map(item => formatTimestamp(item.timestamp));
  const tempData = data.map(item => parseFloat(item.temperature));
  const humidityData = data.map(item => parseFloat(item.humidity));

  createChart(labels, tempData, humidityData);
}

// Call on page load
initChart();