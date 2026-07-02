import React from 'react';
import { StatusHeader } from './components/StatusHeader';
import { GearIndicator } from './components/GearIndicator';
import { CarMonitor } from './components/CarMonitor';
import { LapTimeMonitor } from './components/LapTimeMonitor';
import { TrackProgressMap } from './components/TrackProgressMap';
import { TimingTower } from './components/TimingTower';
import { formatLapTime, formatLiveDelta } from './telemetry/formatters';
import { useTelemetry } from './hooks/useTelemetry';

function App() {
  const { state, isConnected } = useTelemetry();
  
  const playerIndex = state.playerCarIndex ?? 0;
  const player = state.drivers[playerIndex];
  
  // Safe defaults
  const pTelemetry = player?.telemetry || {} as any;
  const pCarStatus = player?.carStatus || {} as any;
  const pLapData = player?.lapData || {} as any;

  return (
    <div style={containerStyle}>
      <StatusHeader connected={isConnected} />

      <main style={dashboardLayout}>

        {/* COLONNA SINISTRA */}
        <div style={leftColumnStyle}>
          <TimingTower
            drivers={state.drivers}
            playerCarIndex={playerIndex}
          />
        </div>

        {/* COLONNA DESTRA */}
        <div style={rightColumnStyle}>
          
          <div style={{ gridColumn: '1', gridRow: '1 / span 2' }}>
            <LapTimeMonitor
              currentLapTime={formatLapTime(pLapData.currentLapTimeInMS)}
              lastLapTime={formatLapTime(pLapData.lastLapTimeInMS)}
              bestLapTime={formatLapTime(pLapData.bestLapTimeInMS)}
              deltaStr={formatLiveDelta(pLapData.liveDelta)}
              sectors={pLapData.sectorData || []}
              carPosition={pLapData.carPosition || 0}
              lapHistory={pLapData.lapHistory || []}
              compoundId={pCarStatus.visualTyreCompound || 16}
              tyreAge={pCarStatus.tyresAgeLaps || 0}
            />
          </div>

          <div style={{ gridColumn: '2', gridRow: '1' }}>
            <GearIndicator
              gear={pTelemetry.gear || 0}
              speed={pTelemetry.speed || 0}
              rpm={pTelemetry.engineRPM || 0}
              revPercent={pTelemetry.revLightsPercent || 0}
              throttle={pTelemetry.throttle || 0}
              brake={pTelemetry.brake || 0}
              drs={pTelemetry.drs || false}
              batteryPercent={((pCarStatus.ersStoreEnergy || 0) / 4000000) * 100}
            />
          </div>

          <div style={{ gridColumn: '3', gridRow: '1' }}>
            <CarMonitor
              engineTemperature={pTelemetry.engineTemperature || 0}
              brakesTemperature={pTelemetry.brakesTemperature || [0,0,0,0]}
              tyresSurfaceTemps={pTelemetry.tyresSurfaceTemperature || [0,0,0,0]}
              tyresInnerTemps={pTelemetry.tyresInnerTemperature || [0,0,0,0]}
              tyresPressure={pTelemetry.tyresPressure || [0,0,0,0]}
              tyresCompound={pCarStatus.visualTyreCompound || 16}
              tyresAgeLaps={pCarStatus.tyresAgeLaps || 0}
            />
          </div>

          <div style={{ gridColumn: '2 / span 2', gridRow: '2' }}>
            <TrackProgressMap
              lapDistance={pLapData.lapDistance || 0}
              trackLength={state.sessionData.trackLength || 0}
              trackId={state.sessionData.trackId || 0}
              participant={player?.participant}
            />
          </div>
        </div>

      </main>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  backgroundColor: '#0a0a0a',
  color: '#fff',
  minHeight: '100vh',
  padding: '40px 20px', 
  fontFamily: '"JetBrains Mono", monospace',
  width: '100%',
  boxSizing: 'border-box'
};

const dashboardLayout: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '450px 1fr', // 450px per la Timing Tower, il resto per i widget
  gap: '30px',
  alignItems: 'start',
  width: '100%',
  maxWidth: '1800px',
  margin: '0 auto'
};

const leftColumnStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const rightColumnStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '30px',
  alignItems: 'stretch'
};

export default App;