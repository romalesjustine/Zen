'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function ImageCarousel() {
  const images = ['/hero1.png', '/hero2.png', '/hero3.png'];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scale, setScale] = useState(0.5);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;

      const progress = 1 - (elementCenter / windowHeight);

      const clampedProgress = Math.max(0, Math.min(1, progress));

      const newScale = 0.5 + clampedProgress * 1;

      setScale(newScale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const baseHeight = 720;
  const marginOffset = ((scale - 1) * baseHeight) / 2;

  return (
    <div
      ref={containerRef}
      className="relative w-250 h-180 mx-auto overflow-visible rounded-xl shadow-[0_0_8px_rgba(250,250,250,0.5)] transition-all duration-100 ease-out"
      style={{
        transform: `scale(${scale})`,
        marginTop: `${marginOffset}px`,
        marginBottom: `${marginOffset}px`,
      }}
    >
      {images.map((image, index) => (
        <Image
          key={index}
          src={image}
          alt={`Slide ${index + 1}`}
          className={`absolute inset-0 object-contain transition-opacity duration-1500 rounded-lg ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          width={1000}
          height={720}
        />
      ))}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
