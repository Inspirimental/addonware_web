import { useState, useEffect } from "react";

const claims = ["Neugier.", "Schmerz.", "Klarheit.", "einer Entscheidung!"];

export const AnimatedClaim = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    if (hasFinished) return;

    const timer = setTimeout(() => {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex >= claims.length - 1) {
            setHasFinished(true);
          }
          return nextIndex;
        });
        
        setTimeout(() => {
          setIsAnimating(false);
        }, 100);
      }, 400); // Change text at mid-animation
    }, currentIndex === 0 ? 1000 : 2500); // First delay 1s, then 2.5s between changes

    return () => clearTimeout(timer);
  }, [currentIndex, hasFinished]);

  return (
    <div
      className="relative h-[1.2em] overflow-hidden"
      style={{
        perspective: '1000px',
      }}
    >
      <span 
        className={`
          text-primary block absolute inset-0
          transition-all duration-700 ease-out
          ${isAnimating ? 'animate-flip-3d' : ''}
        `}
        style={{
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      >
        {claims[currentIndex]}
      </span>
    </div>
  );
};