const API_KEY = 'YOUR_WEATHER_API_KEY'; // Replace with actual API key

export async function getWeather(lat, lon) {
    try {
        // Simulated weather data for demo
        const weatherData = {
            temp: Math.random() * 30 + 10, // Random temperature between 10-40°C
            conditions: ['sunny', 'rainy', 'cloudy'][Math.floor(Math.random() * 3)]
        };

        return {
            success: true,
            data: weatherData
        };

        // Actual API call would look like this:
        // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        // const data = await response.json();
        // return {
        //     success: true,
        //     data: {
        //         temp: data.main.temp,
        //         conditions: data.weather[0].main.toLowerCase()
        //     }
        // };
    } catch (error) {
        console.error('Error fetching weather:', error);
        return {
            success: false,
            error: 'Failed to fetch weather data'
        };
    }
}

export function getRecommendations(weatherData) {
    if (!weatherData || !weatherData.temp) return [];

    const recommendations = [];

    // Temperature-based recommendations
    if (weatherData.temp > 25) {
        recommendations.push({
            type: 'drink',
            message: 'Hot day! Try our refreshing cold drinks.',
            priority: 'high'
        });
    } else if (weatherData.temp < 15) {
        recommendations.push({
            type: 'drink',
            message: 'Chilly weather! Warm up with our hot beverages.',
            priority: 'high'
        });
    }

    // Condition-based recommendations
    switch (weatherData.conditions) {
        case 'rainy':
            recommendations.push({
                type: 'comfort',
                message: 'Rainy day comfort snacks available!',
                priority: 'medium'
            });
            break;
        case 'sunny':
            recommendations.push({
                type: 'health',
                message: 'Stay hydrated with our water and sports drinks!',
                priority: 'high'
            });
            break;
        case 'cloudy':
            recommendations.push({
                type: 'mood',
                message: 'Brighten your day with our mood-lifting treats!',
                priority: 'medium'
            });
            break;
    }

    return recommendations;
} 