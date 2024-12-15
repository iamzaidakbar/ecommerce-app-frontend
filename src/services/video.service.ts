import type { WeatherType } from '@/services/weather.service';

interface VideoAsset {
  webm: string;  // WebM format for better compression
  mp4: string;   // MP4 fallback
  poster: string; // Static image for loading state
}

const weatherVideos: Record<WeatherType, VideoAsset> = {
  Summer: {
    webm: '/videos/summer.webm',
    mp4: '/videos/summer.mp4',
    poster: '/images/summer-poster.jpg'
  },
  Monsoon: {
    webm: '/videos/monsoon.webm',
    mp4: '/videos/monsoon.mp4',
    poster: '/images/monsoon-poster.jpg'
  },
  'Post-Monsoon': {
    webm: '/videos/post-monsoon.webm',
    mp4: '/videos/post-monsoon.mp4',
    poster: '/images/post-monsoon-poster.jpg'
  },
  Winter: {
    webm: '/videos/winter.webm',
    mp4: '/videos/winter.mp4',
    poster: '/images/winter-poster.jpg'
  },
  Spring: {
    webm: '/videos/spring.webm',
    mp4: '/videos/spring.mp4',
    poster: '/images/spring-poster.jpg'
  }
};

export const videoService = {
  getWeatherVideo(weatherType: WeatherType): VideoAsset {
    return weatherVideos[weatherType];
  }
}; 