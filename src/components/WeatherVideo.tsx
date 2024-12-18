"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { WeatherType } from '@/services/weather.service';
import { videoService } from '@/services/video.service';

interface WeatherVideoProps {
  type: WeatherType;
}

export const WeatherVideo = ({ type }: WeatherVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75; // Slow down playback slightly
      videoRef.current.play();
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 -z-10"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="object-cover w-full h-full"
      >
        <source src={videoService.getWeatherVideo(type).webm} type="video/webm" />
        <source src={videoService.getWeatherVideo(type).mp4} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/20" /> {/* Optional overlay */}
    </motion.div>
  );
}; 