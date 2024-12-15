"use client";

import { useEffect, useState } from 'react';
import { weatherService } from '@/services/weather.service';
import { videoService } from '@/services/video.service';
import { WeatherVideo } from '@/components/WeatherVideo';
import type { WeatherInfo } from '@/services/weather.service';

export default function HomePage() {
  const [weather, setWeather] = useState<WeatherInfo | null>(null);

  useEffect(() => {
    const currentWeather = weatherService.getCurrentWeather();
    setWeather(currentWeather);
  }, []);

  if (!weather) return null;

  const videoAsset = videoService.getWeatherVideo(weather.type);

  return (
    <main className="min-h-screen relative">
      <WeatherVideo {...videoAsset} />
      
      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <h1 className="text-4xl font-light text-white mb-4">
          {weather.type}
        </h1>
        <p className="text-xl text-white/80">
          {weather.description}
        </p>
      </div>
    </main>
  );
}
