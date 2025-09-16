const apiKey = "ae6fdaac9a079338269a5c07fa4b05a8"; // अपनी OpenWeatherMap API key डालें

async function fetchWeather(city = null) {
  const weatherResult = document.getElementById("weatherResult");
  if (!weatherResult) return;

  try {
    let url = "";
    if (city) {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    } else {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.cod != "200") {
      weatherResult.innerHTML = `<p class="text-danger text-center">⚠️ City not found!</p>`;
      return;
    }

    // Clear previous
    weatherResult.innerHTML = "";

    // 5-day forecast
    const dailyData = {};
    data.list.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyData[date]) dailyData[date] = item;
    });

    Object.values(dailyData).slice(0, 5).forEach(day => {
      const date = new Date(day.dt_txt).toDateString();
      const temp = day.main.temp;
      const desc = day.weather[0].description;
      const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

      weatherResult.innerHTML += `
        <div class="col-md-2 text-center mb-4">
          <div class="card shadow">
            <div class="card-body">
              <h6>${date}</h6>
              <img src="${icon}" alt="${desc}">
              <p class="mb-0">${desc}</p>
              <p><b>${temp}°C</b></p>
            </div>
          </div>
        </div>
      `;
    });

  } catch (err) {
    weatherResult.innerHTML = `<p class="text-danger text-center">⚠️ Unable to fetch weather data. Please allow location access.</p>`;
    console.error(err);
  }
}

// Initial fetch using auto location
fetchWeather();

// Search button event
document.getElementById("searchBtn").addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city) fetchWeather(city);
});
