import React, { useState, useEffect } from 'react';

const WEATHER_API_KEY = '1f57e49219d92e15c86d597119e83415';
const UNSPLASH_API_KEY = '_We0CEFbyJqhn_4_ijNWrpsdZEpFtMWaAqYXXBccgO8';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [cityImage, setCityImage] = useState(null);

  const fetchWeather = async () => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric&lang=it`);
    const data = await response.json();
    if (data && !data.error) {
      setWeatherData(data);
    } else {
      setWeatherData(null);
      alert('Città non trovata!');
    }
  };

  useEffect(() => {
    if(weatherData && weatherData.name){
      fetchCityImage(weatherData.name);
    }
  }, [weatherData]);

  const fetchCityImage = async (cityName) => {
    try {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${cityName}&client_id=${UNSPLASH_API_KEY}&per_page=1`);
      const data = await response.json();
      if(data && data.results && data.results.length > 0){
        setCityImage(data.results[0].urls.regular);
      } else {
        setCityImage(null);
      }
    } catch (error) {
      console.error("Errore nel recupero dell'immagine della città:", error);
    }
  };

  const weatherEmojiMap = {
    'cielo sereno': '☀️',
    'poche nuvole': '🌤️',
    'nubi sparse': '⛅',
    'nubi spezzate': '🌥️',
    'pioggia leggera': '🌦️',
    'pioggia': '🌧️',
    'temporale': '⛈️',
    'neve': '❄️',
    'foschia': '🌫️',
    // ... altri codici emoji per condizioni meteo se necessario
  };

  return (
    <div>
      <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Citta'" />
      <button onClick={fetchWeather} disabled={!city.trim()}>Cerca 🔍</button>
      {weatherData && weatherData.main && (
        <div>
            {cityImage && <img src={cityImage} alt={weatherData.name} style={{width: '300px', height: '200px'}} />}
            <h3>{weatherData.name}</h3>
            <p>Temperatura: {weatherData.main.temp}°C</p>
            <p>Meteo: {weatherData.weather[0].description} {weatherEmojiMap[weatherData.weather[0].description] || ''}</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
