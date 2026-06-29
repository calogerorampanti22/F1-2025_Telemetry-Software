import React from 'react';
import { useTelemetry, formatLapTime, formatLiveDelta } from './hooks/useTelemetry';
import { StatusHeader } from './components/StatusHeader';
import { GearIndicator } from './components/GearIndicator';
import { CarMonitor } from './components/CarMonitor';
import { LapTimeMonitor } from './components/LapTimeMonitor';

function App() {
  const { data, isConnected } = useTelemetry();

  return (
    <div style={containerStyle}>
      <StatusHeader connected={isConnected} />

      <main style={dashboardLayout}>

        {/* MONITORAGGIO VETTURA (Temperature, Gomme, Freni) */}
        <CarMonitor
          engineTemperature={data.engineTemperature}
          brakesTemperature={data.brakesTemperature}
          tyresSurfaceTemps={data.tyresSurfaceTemperature}
          tyresInnerTemps={data.tyresInnerTemperature}
          tyresPressure={data.tyresPressure}
          tyresCompound={data.carStatus.visualTyreCompound}
          tyresAgeLaps={data.carStatus.tyresAgeLaps}
        />

        {/* HUD PRINCIPALE (Motore, Marce, Pedali, DRS) */}
        <GearIndicator
          gear={data.gear}
          speed={data.speed}
          rpm={data.engineRPM}
          revPercent={data.revLightsPercent}
          throttle={data.throttle}
          brake={data.brake}
          drs={data.drs}
          batteryPercent={((data.carStatus.ersStoreEnergy || 0) / 4000000) * 100}
        />

        {/* SEZIONE LAP TIMING (Tempi sul giro e settori dinamici) */}
        <LapTimeMonitor
          currentLapTime={formatLapTime(data.lapData.currentLapTimeInMS)}
          lastLapTime={formatLapTime(data.lapData.lastLapTimeInMS)}
          bestLapTime={formatLapTime(data.lapData.bestLapTimeInMS)}
          deltaStr={formatLiveDelta(data.lapData.liveDelta)}
          sectors={data.lapData.sectorData}
          carPosition={data.lapData.carPosition}
          lapHistory={data.lapData.lapHistory}
          compoundId={data.carStatus.visualTyreCompound}
          tyreAge={data.carStatus.tyresAgeLaps}
        />

      </main>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  color: '#fff',
  minHeight: '100vh',
  padding: '40px 20px', // Aumentato un po' il padding superiore
  fontFamily: '"JetBrains Mono", monospace',
  width: '100%',
  boxSizing: 'border-box'
};

const dashboardLayout: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-evenly', // Spalma i 3 moduli uniformemente su tutto lo schermo
  flexWrap: 'wrap',
  gap: '30px',
  alignItems: 'start',
  width: '100%',
  maxWidth: '1800px', // Limite massimo di sicurezza per schermi Ultra-Wide
  margin: '0 auto'    // Centra l'intero blocco se lo schermo è più grande di 1800px
};

export default App;