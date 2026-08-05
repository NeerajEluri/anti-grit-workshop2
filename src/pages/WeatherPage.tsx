import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Farm, WeatherData } from '../types';
import { WeatherDashboard } from '../components/weather/WeatherDashboard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const WeatherPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.get('/farms')
      .then((res) => {
        const farmList = res.data?.farms || [];
        setFarms(farmList);
        if (farmList.length > 0) {
          fetchWeatherForFarm(farmList[0]);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const fetchWeatherForFarm = async (farm: Farm) => {
    setSelectedFarm(farm);
    setLoading(true);
    try {
      const res = await api.get(`/weather/${farm.id}`);
      setWeather(res.data?.weather || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFarm = (farmId: string) => {
    const found = farms.find((f) => f.id === farmId);
    if (found) fetchWeatherForFarm(found);
  };

  if (loading) return <LoadingSpinner label="Fetching farm microclimate forecast..." />;

  return (
    <WeatherDashboard
      farms={farms}
      selectedFarm={selectedFarm}
      weather={weather}
      onSelectFarm={handleSelectFarm}
    />
  );
};
