import React, { useEffect, useRef, useState } from 'react';

interface ScaleWrapperProps {
  children: React.ReactNode;
  targetWidth?: number;
  targetHeight?: number;
}

export const ScaleWrapper: React.FC<ScaleWrapperProps> = ({
  children,
  targetHeight = 1350
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [virtualWidth, setVirtualWidth] = useState(1920);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parentWidth = window.innerWidth;
        const parentHeight = window.innerHeight;

        // Calcoliamo lo scale in base all'altezza desiderata per far entrare tutto
        const finalScale = parentHeight / targetHeight;
        
        // Calcoliamo la larghezza virtuale necessaria per riempire tutto lo schermo 
        // senza bande nere laterali (letterboxing)
        const finalWidth = parentWidth / finalScale;

        setScale(finalScale);
        setVirtualWidth(finalWidth);
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [targetHeight]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
      }}
    >
      <div
        style={{
          width: virtualWidth,
          height: targetHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0a',
        }}
      >
        {children}
      </div>
    </div>
  );
};
