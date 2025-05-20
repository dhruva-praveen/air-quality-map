npm install openmeteo

import { fetchWeatherApi } from 'openmeteo';

const params = {
    latitude: 52.52,
    longitude: 13.41,
    hourly: ["pm10", "pm2_5"]
};

const url = "https://air-quality-api.open-meteo.com/v1/air-quality";
const responses = await fetchWeatherApi(url, params);

// Process first location
const response = responses[0];

const utcOffsetSeconds = response.utcOffsetSeconds();
const hourly = response.hourly();

// Generate hourly timestamps
const timeArray = [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
    (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
);

// Extract PM values
const pm10Array = hourly.variables(0).valuesArray();
const pm25Array = hourly.variables(1).valuesArray();

// Display in console
console.log("Air Quality Data (PM10 & PM2.5):");
for (let i = 0; i < timeArray.length; i++) {
    console.log(`${timeArray[i].toISOString()} | PM10: ${pm10Array[i]} µg/m³ | PM2.5: ${pm25Array[i]} µg/m³`);
}

// OPTIONAL: If you're using this in a browser and want to show the data in HTML
const container = document.getElementById("air-quality-display");
if (container) {
    container.innerHTML = "<h2>Air Quality Forecast</h2>";
    for (let i = 0; i < timeArray.length; i++) {
        const div = document.createElement("div");
        div.textContent = `${timeArray[i].toLocaleString()} - PM10: ${pm10Array[i]} µg/m³, PM2.5: ${pm25Array[i]} µg/m³`;
        container.appendChild(div);
    }
}
