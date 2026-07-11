let currentLat = null; // Used to store the latitude of the city to be added to the favorites
let currentLon = null; // Used to store the longitude of the city to be added to the favorites
let currentCity = null; // Used to store the name of the city to be added to the favorites

let favorites = []; // Array which holds all the cities that the user has added to their favorites

// Gets the current location of the User
document.getElementById('current-location-button').addEventListener('click', () => {
  document.getElementById('weather-reports').innerHTML = '';

  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
    return;
  }

  // Built in method to get the current location of the device(User)
  navigator.geolocation.getCurrentPosition(
    (position) => { // The block of statements runs if a position is found
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      //console.log(lat, lon);
      currentLat = lat;
      currentLon = lon;
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

// Used to get the coordinates of the city using the name entered by the user
document.getElementById('city-search-button').addEventListener('click', async () => {
  const city = document.querySelector('.search-bar input').value;
  const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`);
  const data = await response.json();
  const lat = data[0].lat;
  const lon = data[0].lon;

  currentLat = lat;
  currentLon = lon;
  currentCity = city;

  document.getElementById('weather-reports').innerHTML = '';
  document.getElementById('place').innerText = "The Weather In " + city;

  getMeteoWeather(lat, lon);
  getOpenWeatherMapWeather(lat, lon);
  getWeatherApiWeather(lat, lon);
});

// Used to get the name of the city using the coordinates retrieved when user clicks current-location-button
async function getCityName(thisLat, thisLon) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${thisLat}&lon=${thisLon}&format=json`);
  const data = await response.json();
  document.getElementById('place').innerText = "The Weather In " + data.address.city;
  currentCity = data.address.city;
}

// Used to get and display the weather conditions using the Meteo Weather api
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

  // Creates the options for the user to switch the temperature unit
  tempUnitSelect.innerHTML = `
    <option value="C">°C</option>
    <option value="F">°F</option>
    <option value="K">K</option>
  `;

  // Created the options for the user to switch the wind speed units
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

// Used to get and display the weather conditions using Open weather Map api
async function getOpenWeatherMapWeather(thisLat, thisLon) {
  const openWeatherMapApiKey = '9f6d9206da4944650ef3e092424069ab'; // I had to get the api key to use this api. I couldn't find the validity period of the api key, so please contact me if some error occurs :)
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

// Used to get and display the weather conditions of the city using the WeatherApi 
async function getWeatherApiWeather(thisLat, thisLon) {
  const weatherApiKey = '748e08e694e74020a62113813260907'; // Validity is till 16/07/2026:)
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

  updateBackground(temp, time); // Used here because this gives the current time's weather

};

// Converts the tempreture values and units
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

// Converts the wind speed values and units
function changeWindUnit(windSpeedPara, unit) {
  const kmh = parseFloat(windSpeedPara.dataset.windKmh);
  if (unit === 'kmh') {
    windSpeedPara.innerHTML = `Wind Speed: ${kmh} km/h`;
  } else if (unit === 'mph') {
    const mph = kmh * 0.621371;
    windSpeedPara.innerHTML = `Wind Speed: ${mph.toFixed(1)} mph`;
  }
}

// Changes the background image depending on the time and weather. For now it's hard coded:)
function updateBackground(temp, time) {
  const hour = parseInt(time.slice(11, 13));
  document.body.classList.remove('night-background', 'cold-day-background', 'hot-day-background');

  if (hour >=  20 || hour < 6) {
    document.body.classList.add('night-background');
    
  } else if (temp < 15) {
    document.body.classList.add('cold-day-background');
  } else if (temp > 15) {
    document.body.classList.add('hot-day-background');
  }
}


// Adds the city that the user searched to the favorites.
document.getElementById("add-favorite-button").addEventListener('click', () => {
  if (!currentLat || !currentLon) {
    alert("Search a location first");
    return;
  }

  favorites.push({name: currentCity, lat: currentLat, lon: currentLon});
  renderFavoritesMenu();
});

// Builds the favorites menu using the array. It does not store anything in the device, favorites are reset when the page is refreshed:)
function renderFavoritesMenu() {
  const menu = document.getElementById("favorites-menu");
  menu.innerHTML = '<option value="">My Favorites</option>';
  for (let i = 0; i < favorites.length; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = favorites[i].name;
    menu.appendChild(option);
  };
};

// Displays the weather conditions of the city that the user selects from the favorites.
document.getElementById("favorites-menu").addEventListener('change', (e) => {
  const selected = favorites[e.target.value];
  if (!selected) return;

  document.getElementById('weather-reports').innerHTML = '';
  document.getElementById('place').innerText = "The Weather In " + selected.name;

  getMeteoWeather(selected.lat, selected.lon);
  getOpenWeatherMapWeather(selected.lat, selected.lon);
  getWeatherApiWeather(selected.lat, selected.lon);
});

