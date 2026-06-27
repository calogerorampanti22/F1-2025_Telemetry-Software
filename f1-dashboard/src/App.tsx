import React from 'react';
import { useTelemetry } from './hooks/useTelemetry';
import { StatusHeader } from './components/StatusHeader';
import { GearIndicator } from './components/GearIndicator';
import { CarMonitor } from './components/CarMonitor';

function App() {
  const { data, isConnected } = useTelemetry();

  return (
    <div style = {containerStyle}>
      <StatusHeader connected = {isConnected} />
      
      <main style = {dashboardLayout}>
        
        {/* HUD PRINCIPALE (Motore, Marce, Pedali, DRS) */}
        <GearIndicator 
          gear = {data.gear} 
          speed = {data.speed}
          rpm = {data.engineRPM} 
          revPercent = {data.revLightsPercent} 
          throttle = {data.throttle} 
          brake = {data.brake} 
          drs = {data.drs}
          batteryPercent = {((data.carStatus.ersStoreEnergy || 0) / 4000000) * 100}
        />
        
        {/* MONITORAGGIO VETTURA (Temperature, Gomme, Freni) */}
        <CarMonitor
          engineTemperature = {data.engineTemperature}
          brakesTemperature = {data.brakesTemperature}
          tyresSurfaceTemps = {data.tyresSurfaceTemperature} 
          tyresInnerTemps = {data.tyresInnerTemperature}
          tyresPressure = {data.tyresPressure}
          tyresCompound = {data.carStatus.visualTyreCompound}
          tyresAgeLaps = {data.carStatus.tyresAgeLaps}
        />

      </main>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  color: '#fff',
  minHeight: '100vh',
  padding: '20px',
  fontFamily: '"JetBrains Mono", monospace',
};

// Modificato da Grid a Flex per centrare comodamente i due maxi-moduli
const dashboardLayout: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap', // Se lo schermo è piccolo, l'auto va sotto l'HUD
  gap: '40px',
  alignItems: 'start',
};

export default App;