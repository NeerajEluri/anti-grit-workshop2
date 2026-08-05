import { WeatherData } from '../../src/types';

export async function getFarmWeather(state: string, district: string): Promise<WeatherData> {
  // In production, integration with OpenWeatherMap / IMD API happens here.
  // We return a structured, realistic agronomic weather snapshot.
  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour <= 18;

  const sampleConditions = [
    { condition: 'Partly Cloudy', temp: 28, humidity: 62, rain: 15, wind: 12, summary: 'Favorable condition for field preparation and fertilizer application.' },
    { condition: 'Sunny & Warm', temp: 31, humidity: 45, rain: 5, wind: 9, summary: 'Optimal sunshine for photosynthesis; ensure regular morning irrigation.' },
    { condition: 'Light Scattered Rain', temp: 25, humidity: 82, rain: 70, wind: 18, summary: 'Moderate rain expected; delay chemical spraying by 24 hours.' },
  ];

  const hash = (state.length + district.length + new Date().getDate()) % sampleConditions.length;
  const picked = sampleConditions[hash];

  return {
    temp_c: picked.temp,
    humidity: picked.humidity,
    rain_probability: picked.rain,
    condition: picked.condition,
    wind_kph: picked.wind,
    forecast_summary: `${picked.summary} Current microclimate for ${district}, ${state}.`,
  };
}
