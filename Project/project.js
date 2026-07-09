

document.getElementById('current-location-button').addEventListener('click', () => {
  document.getElementById('weather-reports').innerHTML = '';

  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      //console.log(lat, lon);
      getCityName(lat,lon);
      getMeteoWeather(lat,lon)
      getOpenWeatherMapWeather(lat,lon);
      getWeatherApiWeather(lat, lon);
    },
    (error) => {
      alert('Unable to retrieve your location');
    }
  );

});

document.getElementById('city-search-button').addEventListener('click', async () => {
  const city = document.querySelector('.search-bar input').value;
  const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`);
  const data = await response.json();
  const lat = data[0].lat;
  const lon = data[0].lon;

  document.getElementById('weather-reports').innerHTML = '';
  document.getElementById('place').innerText = "The Weather In " + city;

  getMeteoWeather(lat, lon);
  getOpenWeatherMapWeather(lat, lon);
  getWeatherApiWeather(lat, lon);
});

async function getCityName(thisLat, thisLon) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${thisLat}&lon=${thisLon}&format=json`);
  const data = await response.json();
  document.getElementById('place').innerText = "The Weather In " + data.address.city;
}

async function getMeteoWeather(thisLat, thisLon) {
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${thisLat}&longitude=${thisLon}&current_weather=true`);
  const data = await response.json();
  //console.log(data.current_weather);
  const time = data.current_weather.time;
  const temp = data.current_weather.temperature;
  const windSpeed = data.current_weather.windspeed;
  
  const openMeteoDiv = document.createElement("div");
  const timePara = document.createElement("p");
  const tempPara = document.createElement("p");
  const windSpeedPara = document.createElement("p");
  const openMeteoHeading = document.createElement("h2");
  const tempUnitSelect = document.createElement("select");
  const tempRow = document.createElement("div");
  const windUnitSelect = document.createElement("select");
  const windRow = document.createElement("div");

  tempUnitSelect.innerHTML = `
    <option value="C">°C</option>
    <option value="F">°F</option>
    <option value="K">K</option>
  `;

  windUnitSelect.innerHTML = `
    <option value="kmh">km/h</option>
    <option value="mph">mph</option>
  `;

  tempPara.dataset.tempC = temp;
  tempPara.innerHTML = `Temperature: ${temp}°C`;

  windSpeedPara.dataset.windKmh = windSpeed;
  windSpeedPara.innerHTML = `Wind Speed: ${windSpeed} km/h`;

  tempUnitSelect.addEventListener('change', () => {
    changeTempUnit(tempPara, tempUnitSelect.value);
  });

  windUnitSelect.addEventListener('change', () => {
    changeWindUnit(windSpeedPara, windUnitSelect.value);
  });

  timePara.innerHTML = `Time: ${time}`;
  tempPara.innerHTML = `Temperature: ${temp}°C`;
  tempRow.className = "temp-row";
  windRow.className = "wind-row";
  windSpeedPara.innerHTML = `Wind Speed: ${windSpeed}`;
  openMeteoHeading.innerText = "Open Meteo Weather Report";

  tempRow.appendChild(tempPara);
  tempRow.appendChild(tempUnitSelect);
  windRow.appendChild(windSpeedPara);
  windRow.appendChild(windUnitSelect);

  openMeteoDiv.appendChild(openMeteoHeading);
  openMeteoDiv.appendChild(timePara);
  openMeteoDiv.appendChild(tempRow);
  openMeteoDiv.appendChild(windRow);
  //document.body.appendChild(openMeteoDiv);
  document.getElementById('weather-reports').appendChild(openMeteoDiv);

}

async function getOpenWeatherMapWeather(thisLat, thisLon) {
  const openWeatherMapApiKey = '9f6d9206da4944650ef3e092424069ab';
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${thisLat}&lon=${thisLon}&appid=${openWeatherMapApiKey}&units=metric`);
  const data = await response.json();
  //console.log(data);
  const date = new Date(data.dt * 1000);
  const time = date.toISOString().slice(0, 16);
  const temp = data.main.temp;
  const windSpeed = data.wind.speed * 3.6;

  const owmDiv = document.createElement("div");
  const timePara = document.createElement("p");
  const tempPara = document.createElement("p");
  const windSpeedPara = document.createElement("p");
  const owmHeading = document.createElement("h2");
  const tempUnitSelect = document.createElement("select");
  const tempRow = document.createElement("div");
  const windUnitSelect = document.createElement("select");
  const windRow = document.createElement("div");

  tempUnitSelect.innerHTML = `
    <option value="C">°C</option>
    <option value="F">°F</option>
    <option value="K">K</option>
  `;

  windUnitSelect.innerHTML = `
    <option value="kmh">km/h</option>
    <option value="mph">mph</option>
  `;

  tempPara.dataset.tempC = temp;
  tempPara.innerHTML = `Temperature: ${temp}°C`;

  windSpeedPara.dataset.windKmh = windSpeed;
  windSpeedPara.innerHTML = `Wind Speed: ${windSpeed} km/h`;

  tempUnitSelect.addEventListener('change', () => {
    changeTempUnit(tempPara, tempUnitSelect.value);
  });

  windUnitSelect.addEventListener('change', () => {
    changeWindUnit(windSpeedPara, windUnitSelect.value);
  });

  timePara.innerHTML = `Time: ${time}`;
  tempPara.innerHTML = `Temperature: ${temp}°C`;
  tempRow.className = "temp-row";
  windSpeedPara.innerHTML = `Wind Speed: ${windSpeed}`;
  windRow.className = "wind-row";
  owmHeading.innerText = "OpenWeatherMap Weather Report";

  tempRow.appendChild(tempPara);
  tempRow.appendChild(tempUnitSelect);
  windRow.appendChild(windSpeedPara);
  windRow.appendChild(windUnitSelect);

  owmDiv.appendChild(owmHeading);
  owmDiv.appendChild(timePara);
  owmDiv.appendChild(tempRow);
  owmDiv.appendChild(windRow);
  //document.body.appendChild(owmDiv);
  document.getElementById('weather-reports').appendChild(owmDiv);

};

async function getWeatherApiWeather(thisLat, thisLon) {
  const weatherApiKey = '748e08e694e74020a62113813260907';
  const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${thisLat},${thisLon}`);
  const data = await response.json();
  //console.log(data);
  const time = data.current.last_updated;
  const temp = data.current.temp_c;
  const windSpeed = data.current.wind_kph;

  const weatherApiDiv = document.createElement("div");
  const timePara = document.createElement("p");
  const tempPara = document.createElement("p");
  const windSpeedPara = document.createElement("p");
  const weatherApiHeading = document.createElement("h2");
  const tempUnitSelect = document.createElement("select");
  const tempRow = document.createElement("div");
  const windUnitSelect = document.createElement("select");
  const windRow = document.createElement("div");

  tempUnitSelect.innerHTML = `
    <option value="C">°C</option>
    <option value="F">°F</option>
    <option value="K">K</option>
  `;

  windUnitSelect.innerHTML = `
    <option value="kmh">km/h</option>
    <option value="mph">mph</option>
  `;

  tempPara.dataset.tempC = temp;
  tempPara.innerHTML = `Temperature: ${temp}°C`;

  windSpeedPara.dataset.windKmh = windSpeed;
  windSpeedPara.innerHTML = `Wind Speed: ${windSpeed} km/h`;

  tempUnitSelect.addEventListener('change', () => {
    changeTempUnit(tempPara, tempUnitSelect.value);
  });

  windUnitSelect.addEventListener('change', () => {
    changeWindUnit(windSpeedPara, windUnitSelect.value);
  });

  timePara.innerHTML = `Time: ${time}`;
  tempRow.className = "temp-row";
  windSpeedPara.innerHTML = `Wind Speed: ${windSpeed}`;
  windRow.className = "wind-row";
  weatherApiHeading.innerText = "WeatherAPI Weather Report";

  tempRow.appendChild(tempPara);
  tempRow.appendChild(tempUnitSelect);
  windRow.appendChild(windSpeedPara);
  windRow.appendChild(windUnitSelect);
  weatherApiDiv.appendChild(weatherApiHeading);
  weatherApiDiv.appendChild(timePara);
  weatherApiDiv.appendChild(tempRow);
  weatherApiDiv.appendChild(windRow);
  document.getElementById('weather-reports').appendChild(weatherApiDiv);
};


function changeTempUnit(tempPara, unit) {
  const celsius = parseFloat(tempPara.dataset.tempC);
  if (unit === 'C') {
    tempPara.innerHTML = `Temperature: ${celsius}°C`;
  } else if (unit === 'F') {
    const f = (celsius * 9/5) + 32;
    tempPara.innerHTML = `Temperature: ${f.toFixed(1)}°F`;
  } else if (unit === 'K') {
    const k = celsius + 273.15;
    tempPara.innerHTML = `Temperature: ${k.toFixed(1)}K`;
  }
}

function changeWindUnit(windSpeedPara, unit) {
  const kmh = parseFloat(windSpeedPara.dataset.windKmh);
  if (unit === 'kmh') {
    windSpeedPara.innerHTML = `Wind Speed: ${kmh} km/h`;
  } else if (unit === 'mph') {
    const mph = kmh * 0.621371;
    windSpeedPara.innerHTML = `Wind Speed: ${mph.toFixed(1)} mph`;
  }
}