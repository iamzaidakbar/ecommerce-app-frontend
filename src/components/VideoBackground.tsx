"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
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
        <source src="/videos/campaign_add.mp4" type="video/mp4" />
        <source src="/videos/campaign_add.webm" type="video/webm" />
      </video>
      <div className="absolute inset-0 bg-black/20" />
    </motion.div>
  );
}; 