const apiKey = "a3d7ed6d702641eb99462157252601"; // WeatherAPI.com API key
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const city = document.getElementById('city');
const country = document.getElementById('country');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const maxTemp = document.getElementById('max-temp');
const minTemp = document.getElementById('min-temp');
const aqi = document.getElementById('aqi');
const aqiText = document.getElementById('aqi-text');

function getAQIDescription(aqi) {
    if (aqi <= 50) {
        return ['Good', 'aqi-good'];
    } else if (aqi <= 100) {
        return ['Satisfactory', 'aqi-satisfactory'];
    } else if (aqi <= 200) {
        return ['Moderate', 'aqi-moderate'];
    } else if (aqi <= 300) {
        return ['Poor', 'aqi-poor'];
    } else if (aqi <= 400) {
        return ['Very Poor', 'aqi-very-poor'];
    } else {
        return ['Severe', 'aqi-severe'];
    }
}

async function getWeather(location) {
    try {
        const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1&aqi=yes`);
        
        if (!response.ok) {
            throw new Error('Location not found');
        }

        const data = await response.json();
        updateUI(data);
    } catch (error) {
        alert(error.message);
    }
}

function updateUI(data) {
    city.textContent = data.location.name;
    country.textContent = data.location.country;
    temperature.textContent = `${Math.round(data.current.temp_c)}°C`;
    description.textContent = data.current.condition.text;
    weatherIcon.src = `https:${data.current.condition.icon}`;
    humidity.textContent = `${data.current.humidity}%`;
    windSpeed.textContent = `${data.current.wind_kph} km/h`;
    
    // Add max and min temperature
    maxTemp.textContent = `${Math.round(data.forecast.forecastday[0].day.maxtemp_c)}°C`;
    minTemp.textContent = `${Math.round(data.forecast.forecastday[0].day.mintemp_c)}°C`;

    // Add AQI information
    const aqiValue = Math.round(data.current.air_quality.pm2_5);
    const [aqiDescription, aqiClass] = getAQIDescription(aqiValue);
    aqi.textContent = `${aqiValue}`;
    aqiText.textContent = aqiDescription;
    
    // Remove any existing AQI classes
    aqiText.className = 'aqi-description';
    // Add the new AQI class
    aqiText.classList.add(aqiClass);
}

searchBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) {
        getWeather(location);
    }
});

locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const location = locationInput.value.trim();
        if (location) {
            getWeather(location);
        }
    }
});
