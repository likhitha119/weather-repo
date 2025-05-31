const apiKey = 'f31791ca353695426ed2181e228f6c89'; // Replace with your API key

function updateBackground() {
  document.body.style.background = 'url("images/sunny.jpeg") no-repeat center center fixed';
  document.body.style.backgroundSize = 'cover';
}
async function getWeather() {
  const city = document.getElementById('cityInput').value;
  if (!city) return alert('Enter a city name');
  await fetchWeatherByCity(city);
}

async function getWeatherByLocation() {
  if (!navigator.geolocation) {
    return alert("Geolocation not supported");
  }
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    await fetchWeatherByCoords(latitude, longitude);
  });
}

async function fetchWeatherByCity(city) {
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  await displayWeather(currentUrl, forecastUrl);
}

async function fetchWeatherByCoords(lat, lon) {
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  await displayWeather(currentUrl, forecastUrl);
}

async function displayWeather(currentUrl, forecastUrl) {
  try {
    const currentRes = await fetch(currentUrl);
    const forecastRes = await fetch(forecastUrl);
    if (!currentRes.ok || !forecastRes.ok) throw new Error("City not found");

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    const result = `
      <h2>${currentData.name}, ${currentData.sys.country}</h2>
      <p><strong>${currentData.weather[0].main}</strong> - ${currentData.weather[0].description}</p>
      <p>🌡️ Temp: ${currentData.main.temp}°C</p>
      <p>💨 Wind: ${currentData.wind.speed} m/s</p>
      <img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" />
    `;
    document.getElementById('weatherResult').innerHTML = result;

    const forecastList = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
    const forecastHTML = forecastList.slice(0, 5).map(item => `
      <div class="forecast-day">
        <p><strong>${new Date(item.dt_txt).toLocaleDateString()}</strong></p>
        <p>${item.weather[0].main}</p>
        <p>🌡️ ${item.main.temp}°C</p>
        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" />
      </div>
    `).join('');

    document.getElementById('forecast').innerHTML = forecastHTML;
  } catch (err) {
    document.getElementById('weatherResult').innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

// Set background on load
updateBackground();
