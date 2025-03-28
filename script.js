const form = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const forecast = document.getElementById('forecast');
const errorMessage = document.getElementById('error-message');
const apiKey = 'dadf454ceff2de19fa7056011a75fea7';

form.addEventListener('submit', function (e){
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeather(city);
  }
});

async function getWeather(city) {
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const currentWeatherResponse = await fetch(currentWeatherUrl);
    const forecastResponse = await fetch(forecastUrl);

    if (!currentWeatherResponse.ok || !forecastResponse.ok) {
      throw new Error('City not found');
    }

    const currentWeather = await currentWeatherResponse.json();
    const forecastData = await forecastResponse.json();

    displayWeather(currentWeather);
    displayForecast(forecastData);
    errorMessage.style.display = 'none';
  } catch (error) {
    errorMessage.textContent = 'City not found. Please try again.';
    errorMessage.style.display = 'block';
    weatherInfo.style.display = 'none';
    forecast.style.display = 'none';
  }
}

function displayWeather(data) {
  const cityName = data.name;
  const temperature = data.main.temp;
  const weatherDescription = data.weather[0].description;
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const icon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  const currentDate = new Date().toLocaleDateString();

  document.getElementById('city-name').textContent = `${cityName}, ${currentDate}`;
  document.getElementById('current-temp').textContent = `Temperature: ${temperature}°C`;
  document.getElementById('weather-desc').textContent = `Weather: ${weatherDescription}`;
  document.getElementById('humidity').textContent = `Humidity: ${humidity}%`;
  document.getElementById('wind-speed').textContent = `Wind Speed: ${windSpeed} m/s`;
  document.getElementById('weather-icon').src = icon;

  weatherInfo.style.display = 'block';
}

function displayForecast(data) {
  const forecastList = document.getElementById('forecast-list');
  forecastList.innerHTML = '';

  data.list.forEach((item, index) => {
    if (index % 8 === 0) {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      const temp = item.main.temp;
      const weatherDesc = item.weather[0].description;
      const icon = `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

      const forecastDay = document.createElement('div');
      forecastDay.classList.add('forecast-day');

      forecastDay.innerHTML = `
        <p>${date}</p>
        <p>Temp: ${temp}°C</p>
        <p>${weatherDesc}</p>
        <div class="icon-div"><img src="${icon}" /></div>
      `;

      forecastList.appendChild(forecastDay);
    }

    

  });

  forecast.style.display = 'block';
}
