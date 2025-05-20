const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('city');
const aqiDisplay = document.getElementById('aqiDisplay'); // For displaying AQI

// Your Weatherbit API key
const apiKey = '2a12f8eddee34f54a3d17c7cfd98b7f2'; // Weatherbit API key
const geoApiKey = 'aab53975799440b9993e0df38968b0fd'; // Your Geocoding API key

searchBtn.addEventListener('click', async function () {
    const city = cityInput.value.trim();
    if (city === "") return alert("Please enter a city name!");

    try {
        // Step 1: Get latitude and longitude for the city using the Geocoding API (OpenCage)
        const geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${geoApiKey}`;

        const geoResponse = await fetch(geoUrl);
        const geoData = await geoResponse.json();

        // Check if city was found by geocoding service
        if (geoData.results.length === 0) {
            alert("City not found. Please try another.");
            return;
        }

        const lat = geoData.results[0].geometry.lat;
        const lon = geoData.results[0].geometry.lng;

        console.log(`Latitude: ${lat}, Longitude: ${lon}`); // Check coordinates in the console

        // Step 2: Use lat and lon to get air quality data from Weatherbit API
        const airQualityUrl = `https://api.weatherbit.io/v2.0/current/airquality?lat=${lat}&lon=${lon}&key=${apiKey}`;

        const airQualityResponse = await fetch(airQualityUrl);
        const airQualityData = await airQualityResponse.json();

        console.log('Air Quality Data:', airQualityData); // Log air quality data to the console

        // Step 3: Get the Air Quality Index (AQI)
        const aqi = airQualityData.data[0].aqi; // AQI value

        // Display AQI value
        aqiDisplay.textContent = `Air Quality Index (AQI) for ${city}: ${aqi}`;

    } catch (error) {
        console.error("Error:", error);
        alert("Unable to fetch data. Please try again later.");
    }
});
