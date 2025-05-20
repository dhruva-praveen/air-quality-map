const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('city');
const ctx = document.getElementById('airQualityChart').getContext('2d');

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

        // Step 2: Use lat and lon to get air quality data from Weatherbit API
        const airQualityUrl = `https://api.weatherbit.io/v2.0/current/airquality?lat=${lat}&lon=${lon}&key=${apiKey}`;

        const airQualityResponse = await fetch(airQualityUrl);
        const airQualityData = await airQualityResponse.json();

        // Check if air quality data was returned
        if (!airQualityData.data) {
            alert("Unable to fetch air quality data. Please try again.");
            return;
        }

        // Step 3: Get air quality data from Weatherbit API response
        const airQuality = airQualityData.data[0].aqi; // Air Quality Index (AQI)
        const pm25 = airQualityData.data[0].pm25;     // PM2.5 (particulate matter 2.5)
        const pm10 = airQualityData.data[0].pm10;     // PM10 (particulate matter 10)
        const no2 = airQualityData.data[0].no2;       // Nitrogen Dioxide (NO2)
        const co = airQualityData.data[0].co;         // Carbon Monoxide (CO)

        // Step 4: Create a chart to display air quality data
        const airQualityChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['AQI', 'PM2.5', 'PM10', 'NO2', 'CO'],
                datasets: [{
                    label: 'Air Quality Measurements',
                    data: [airQuality, pm25, pm10, no2, co],
                    backgroundColor: [
                        '#4CAF50', '#FF9800', '#FF5722', '#FF0000', '#607D8B'
                    ],
                    borderColor: '#fff',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw}`;
                            }
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Error:", error);
        alert("Unable to fetch data. Please try again later.");
    }
});
