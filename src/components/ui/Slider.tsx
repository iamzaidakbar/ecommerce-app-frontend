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
      minStepsBetweenThumbs={1}
    >
      <SliderPrimitive.Track className="relative h-[1px] w-full bg-gray-200 dark:bg-gray-800">
        <SliderPrimitive.Range className="absolute h-[1px] bg-black dark:bg-white" />
      </SliderPrimitive.Track>
      {value.map((_, index) => (
        <SliderPrimitive.Thumb
          key={index}
          className="block h-3 w-3 rounded-full border border-black dark:border-white bg-white dark:bg-black focus:outline-none focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white"
        />
      ))}
    </SliderPrimitive.Root>
  );
} 