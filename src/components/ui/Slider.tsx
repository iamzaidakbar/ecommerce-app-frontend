"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

interface SliderProps {
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  min: number;
  max: number;
  step: number;
}

export function Slider({ value, onValueChange, min, max, step }: SliderProps) {
  return (
    <SliderPrimitive.Root
      className="relative flex items-center w-full h-5 touch-none select-none"
      value={value}
      onValueChange={onValueChange}
      max={max}
      min={min}
      step={step}
    >
      <SliderPrimitive.Track className="relative h-[2px] w-full grow bg-gray-200 dark:bg-gray-800">
        <SliderPrimitive.Range className="absolute h-full bg-black dark:bg-white" />
      </SliderPrimitive.Track>
      {value.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block h-4 w-4 rounded-full border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
      ))}
    </SliderPrimitive.Root>
  );
} 