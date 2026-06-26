import React from 'react';

interface Props {
  gear: number;
  speed: number;
  rpm: number;
  revPercent: number;
  throttle: number;
  brake: number;
  drs: boolean;
}

export const GearIndicator: React.FC<Props> = ({ gear, speed, rpm, revPercent, throttle, brake, drs }) => {
  const getRpmColor = (percent: number) => {
    if (percent > 90) return '#a855f7'; // Viola (Shift point)
    if (percent > 75) return '#ef4444'; // Rosso
    if (percent > 50) return '#eab308'; // Giallo
    return '#22c55e'; // Verde
  };

  // Paracadute matematico per le barre
  const tHeight = Math.min(100, Math.max(0, (throttle || 0) * 100));
  const bHeight = Math.min(100, Math.max(0, (brake || 0) * 100));

  return (
    <section style={centralSection}>
      
      {/* LATO SINISTRO: FRENO */}
      <div style={pedalWrapper}>
        <span style={{ ...verticalText, transform: 'rotate(180deg)' }}>BRAKE</span>
        <div style={pedalContainer}>
          <div style={{ ...pedalFill, height: `${bHeight}%`, backgroundColor: '#ef4444' }} />
        </div>
      </div>

      {/* CENTRO: GIRI, MARCIA, VELOCITÀ E DRS */}
      <div style={coreInfo}>

        {/* INDICATORE DRS INGLOBATO AL CENTRO */}
        <div style={{
          ...drsBadge,
          backgroundColor: drs ? '#22c55e' : '#222',
          color: drs ? '#000' : '#555',
          boxShadow: drs ? '0 0 20px rgba(34, 197, 94, 0.4)' : 'none'
        }}>
          DRS
        </div>

        <div style={gearContainer}>
          <span style={gearLabel}>GEAR</span>
          <span style={gearValue}>{gear === 0 ? 'N' : (gear === -1 ? 'R' : gear)}</span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={speedValue}>{speed} <span style={{ fontSize: '1.5rem', color: '#666' }}>km/h</span></div>
          <div style={rpmLabel}>{rpm} RPM</div>
        </div>


        <div style={rpmBarContainer}>
          <div style={{
            ...rpmBarFill,
            width: `${revPercent}%`,
            backgroundColor: getRpmColor(revPercent)
          }} />
        </div>

      </div>

      {/* LATO DESTRO: ACCELERATORE */}
      <div style={pedalWrapper}>
        <div style={pedalContainer}>
          <div style={{ ...pedalFill, height: `${tHeight}%`, backgroundColor: '#22c55e' }} />
        </div>
        <span style={verticalText}>THROTTLE</span>
      </div>

    </section>
  );
};

/* --- STILI --- */

const centralSection: React.CSSProperties = { 
  display: 'flex', 
  flexDirection: 'row', 
  alignItems: 'center', 
  justifyContent: 'center', 
  padding: '15px', 
  backgroundColor: '#111', 
  borderRadius: '20px', 
  border: '1px solid #222',
  gap: '40px' // Spazio tra i pedali e il blocco centrale
};

const coreInfo: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: '250px'
};

const gearContainer: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' };
const gearLabel: React.CSSProperties = { fontSize: '1rem', color: '#444', fontWeight: 'bold' };
const gearValue: React.CSSProperties = { fontSize: '8rem', fontWeight: 900, lineHeight: 1 };
const speedValue: React.CSSProperties = { fontSize: '4rem', fontWeight: 'bold', margin: '10px 0' };
const rpmLabel: React.CSSProperties = { fontSize: '1.2rem', color: '#888' };

const rpmBarContainer: React.CSSProperties = { width: '100%', height: '12px', backgroundColor: '#222', borderRadius: '6px', marginBottom: '20px', overflow: 'hidden' };
const rpmBarFill: React.CSSProperties = { height: '100%', transition: 'width 0.05s linear, background-color 0.2s' };

const pedalWrapper: React.CSSProperties = { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' };
const pedalContainer: React.CSSProperties = { width: '40px', height: '250px', backgroundColor: '#222', position: 'relative', borderRadius: '4px', overflow: 'hidden' };
const pedalFill: React.CSSProperties = { width: '100%', position: 'absolute', bottom: 0, left: 0, transition: 'height 0.05s linear' };
const verticalText: React.CSSProperties = { writingMode: 'vertical-rl', fontSize: '0.85rem', color: '#888', fontWeight: 'bold', letterSpacing: '3px', textOrientation: 'mixed' };

const drsBadge: React.CSSProperties = {
  padding: '8px 20px',
  textAlign: 'center',
  borderRadius: '6px',
  fontSize: '1rem',
  fontWeight: 900,
  letterSpacing: '2px',
  transition: 'all 0.1s ease-in-out',
  width: '20%'
};