const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('city');
const ctx = document.getElementById('airQualityChart').getContext('2d');

// Replace with your API key from Weatherbit or another air quality service
const apiKey = '2a12f8eddee34f54a3d17c7cfd98b7f2	'; // Replace with your actual API key

searchBtn.addEventListener('click', async function() {
    const city = cityInput.value.trim();
    if (city === "") return alert("Please enter a city name!");

    const url = `https://api.weatherbit.io/v2.0/current/airquality?city=${city}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.data) {
            alert("City not found. Please try another.");
            return;
        }

        const airQuality = data.data[0].aqi;
        const pm25 = data.data[0].pm25;
        const pm10 = data.data[0].pm10;
        const no2 = data.data[0].no2;
        const co = data.data[0].co;

        // Create a chart
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
                            label: function(tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw}`;
                            }
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Unable to fetch air quality data. Please try again later.");
    }
});
