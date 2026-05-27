function getWeatherIcon(condition) {
  if (condition.includes('cloud')) return '<i class="fas fa-cloud"></i>';
  if (condition.includes('rain')) return '<i class="fas fa-cloud-showers-heavy"></i>';
  if (condition.includes('clear')) return '<i class="fas fa-sun"></i>';
  if (condition.includes('snow')) return '<i class="fas fa-snowflake"></i>';
  return '<i class="fas fa-smog"></i>';
}

async function fetchWeather() {
  const city = document.getElementById('cityInput').value.trim();

  if (!city) {
    alert('⚠️ Please enter a city name.');
    return;
  }

  try {
    const currentRes = await fetch(`/weather/current?city=${city}`);
    if (!currentRes.ok) throw new Error('Invalid city');
    const current = await currentRes.json();
    const icon = getWeatherIcon(current.weather[0].description);
    document.getElementById('current').innerHTML = `
      <h2>Current Weather</h2>
      <p>${icon} <strong>${current.weather[0].description}</strong></p>
      <p>🌡️ Temperature: ${current.main.temp}°C</p>
    `;
  } catch (err) {
    alert(`❌ "${city}" not found. Please enter a valid city name.`);
    return;
  }

  try {
    const forecastRes = await fetch(`/weather/forecast?city=${city}&days=3`);
    const forecast = await forecastRes.json();
    const labels = forecast.list.map(item => item.dt_txt.split(' ')[0]);
    const temps = forecast.list.map(item => item.main.temp);

    const ctx = document.getElementById('forecastChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Temperature (°C)',
          data: temps,
          borderColor: '#ff6f61',
          backgroundColor: 'rgba(255,111,97,0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: { enabled: true }
        }
      }
    });
  } catch (err) {
    console.warn('Forecast data unavailable');
  }

  try {
    const alertsRes = await fetch(`/weather/alerts?city=${city}`);
    const alerts = await alertsRes.json();
    let alertsHTML = '<h2>Alerts</h2>';
    if (alerts.length === 0) {
      alertsHTML += '<p>✅ No alerts at the moment</p>';
    } else {
      alerts.forEach(alert => {
        alertsHTML += `<p><strong>⚠️ ${alert.event}</strong>: ${alert.description}</p>`;
      });
    }
    document.getElementById('alerts').innerHTML = alertsHTML;
  } catch (err) {
    console.warn('Alert data unavailable');
  }
}