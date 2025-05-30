const apiKey = "b8faa52ae21346f103ae59f4509f6e4c";

function handleEnter(event) {
  if (event.key === "Enter") {
    getWeather();
  }
}

function getWeather() {
  const city = document.getElementById("city").value;
  if (!city) return alert("Enter a city name");
  fetchWeather(city);
}

function fetchWeather(city) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  fetch(weatherUrl)
    .then(res => res.json())
    .then(data => {
      document.getElementById("weather").innerHTML = `
        <div class="current-weather">
          <h2>${data.name}, ${data.sys.country}</h2>
          <div class="temp">${Math.round(data.main.temp)}°</div>
          <p class="desc">${data.weather[0].main}</p>
          <p>${data.weather[0].description}</p>
        </div>
      `;
    });

  fetch(forecastUrl)
    .then(res => res.json())
    .then(data => {
      const forecastDiv = document.getElementById("forecast");
      forecastDiv.innerHTML = "";
      const days = {};

      data.list.forEach(entry => {
        const date = entry.dt_txt.split(" ")[0];
        if (!days[date] && Object.keys(days).length < 5) {
          days[date] = entry;
        }
      });

      Object.values(days).forEach(entry => {
        const date = entry.dt_txt.split(" ")[0];
        forecastDiv.innerHTML += `
          <div class="forecast-hour">
            <p>${date}</p>
            <img src="https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png" alt="">
            <p>${Math.round(entry.main.temp)}°C</p>
            <p>${entry.weather[0].main}</p>
          </div>
        `;
      });
    });
}

function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

      fetch(weatherUrl)
        .then(res => res.json())
        .then(data => {
          document.getElementById("weather").innerHTML = `
            <div class="current-weather">
              <h2>Your Location: ${data.name}, ${data.sys.country}</h2>
              <div class="temp">${Math.round(data.main.temp)}°</div>
              <p class="desc">${data.weather[0].main}</p>
              <p>${data.weather[0].description}</p>
            </div>
          `;
        });

      fetch(forecastUrl)
        .then(res => res.json())
        .then(data => {
          const forecastDiv = document.getElementById("forecast");
          forecastDiv.innerHTML = "";
          const days = {};

          data.list.forEach(entry => {
            const date = entry.dt_txt.split(" ")[0];
            if (!days[date] && Object.keys(days).length < 5) {
              days[date] = entry;
            }
          });

          Object.values(days).forEach(entry => {
            const date = entry.dt_txt.split(" ")[0];
            forecastDiv.innerHTML += `
              <div class="forecast-hour">
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png" alt="">
                <p>${Math.round(entry.main.temp)}°C</p>
                <p>${entry.weather[0].main}</p>
              </div>
            `;
          });
        });
    }, () => {
      alert("Unable to retrieve your location");
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Remove automatic fetching on page load by NOT calling getLocationWeather here
// window.onload = function () {
//   getLocationWeather();
// };
