import React from 'react';

interface Props {
  surfaceTemps: [number, number, number, number];
  innerTemps: [number, number, number, number];
  pressures: [number, number, number, number];
}

// Ordine degli indici F1: 0: RL, 1: RR, 2: FL, 3: FR

export const CarMonitor: React.FC<Props> = ({ surfaceTemps, innerTemps }) => {
  const getTempColor = (temp: number) => {
    if (temp > 105) return '#ef4444'; // Rosso
    if (temp < 80) return '#3b82f6';  // Blu
    return '#22c55e';                 // Verde
  };

  const getBrakeColor = (temp: number) => {
    if (temp > 800) return '#ef4444'; // Rosso (Surriscaldati)
    if (temp < 300) return '#3b82f6'; // Blu (Freddi)
    return '#2cb00b';                 // Giallo/Arancio (Ottimali)
  };

  // Segnaposto
  const placeholderBrakeTemps = [678, 678, 657, 656];
  const placeholderEngineTemp = 110;

  return (
    <section style={containerStyle}>
      <div style={layoutGrid}>
        
        {/* COLONNA SINISTRA */}
        <div style={dataColumnLeft}>
          <div style={tyreDataBlock}>
            <DataRow label="SURF" value={surfaceTemps[2]} type="surf" color={getTempColor(surfaceTemps[2])} />
            <DataRow label="CORE" value={innerTemps[2]} type="core" color={getTempColor(innerTemps[2])} />
            <DataRow label="BRK" value={placeholderBrakeTemps[2]} type="brake" color={getBrakeColor(placeholderBrakeTemps[2])} />
          </div>
          <div style={tyreDataBlock}>
            <DataRow label="SURF" value={surfaceTemps[0]} type="surf" color={getTempColor(surfaceTemps[0])} />
            <DataRow label="CORE" value={innerTemps[0]} type="core" color={getTempColor(innerTemps[0])} />
            <DataRow label="BRK" value={placeholderBrakeTemps[0]} type="brake" color={getBrakeColor(placeholderBrakeTemps[0])} />
          </div>
        </div>

        {/* CENTRO: L'SVG della vettura */}
        <div style={carWrapper}>
          <svg viewBox="0 0 200 300" style={{ width: '100%', height: '100%', maxWidth: '220px' }}>
            
            {/* WIREFRAME TELAIO */}
            <g fill="none" stroke="#444" strokeWidth="3" opacity="0.8">
              <path d="M 50,30 L 150,30 L 155,50 L 45,50 Z" />
              <path d="M 85,50 L 115,50 L 105,100 L 95,100 Z" />
              <path d="M 95,100 C 50,120 40,200 70,250 L 130,250 C 160,200 150,120 105,100 Z" />
              <path d="M 60,260 L 140,260 L 140,285 L 60,285 Z" />
              <ellipse cx="100" cy="130" rx="14" ry="20" />
            </g>

            {/* SOSPENSIONI E ASSALI */}
            <g stroke="#444" strokeWidth="2" opacity="0.6">
              <line x1="57" y1="97" x2="95" y2="85" />
              <line x1="143" y1="97" x2="105" y2="85" />
              <line x1="61" y1="232" x2="85" y2="220" />
              <line x1="139" y1="232" x2="115" y2="220" />
            </g>

            {/* MOTORE */}
            <path d="M 85,170 L 115,170 L 110,210 L 90,210 Z" fill={getTempColor(placeholderEngineTemp)} stroke="#111" strokeWidth="2" />
            <text x="100" y="160" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">{placeholderEngineTemp}°C</text>

            {/* FRENI VISIBILI */}
            <rect x="58" y="82" width="6" height="31" rx="2" fill={getBrakeColor(placeholderBrakeTemps[2])} />
            <rect x="136" y="82" width="6" height="31" rx="2" fill={getBrakeColor(placeholderBrakeTemps[3])} />
            <rect x="58" y="217" width="6" height="31" rx="2" fill={getBrakeColor(placeholderBrakeTemps[0])} />
            <rect x="136" y="217" width="6" height="31" rx="2" fill={getBrakeColor(placeholderBrakeTemps[1])} />

            {/* === PNEUMATICI (Cuore = Carcassa/Interna, Bordo = Superficie/Esterna) === */}
            <rect x="37" y="77" width="18" height="41" rx="3" fill={getTempColor(innerTemps[2])} stroke={getTempColor(surfaceTemps[2])} strokeWidth="4" />
            <rect x="145" y="77" width="18" height="41" rx="3" fill={getTempColor(innerTemps[3])} stroke={getTempColor(surfaceTemps[3])} strokeWidth="4" />
            <rect x="37" y="212" width="18" height="41" rx="3" fill={getTempColor(innerTemps[0])} stroke={getTempColor(surfaceTemps[0])} strokeWidth="4" />
            <rect x="145" y="212" width="18" height="41" rx="3" fill={getTempColor(innerTemps[1])} stroke={getTempColor(surfaceTemps[1])} strokeWidth="4" />
          </svg>
        </div>

        {/* COLONNA DESTRA */}
        <div style={dataColumnRight}>
          <div style={tyreDataBlock}>
            <DataRow label="SURF" value={surfaceTemps[3]} type="surf" color={getTempColor(surfaceTemps[3])} align="left" />
            <DataRow label="CORE" value={innerTemps[3]} type="core" color={getTempColor(innerTemps[3])} align="left" />
            <DataRow label="BRK" value={placeholderBrakeTemps[3]} type="brake" color={getBrakeColor(placeholderBrakeTemps[3])} align="left" />
          </div>
          <div style={tyreDataBlock}>
            <DataRow label="SURF" value={surfaceTemps[1]} type="surf" color={getTempColor(surfaceTemps[1])} align="left" />
            <DataRow label="CORE" value={innerTemps[1]} type="core" color={getTempColor(innerTemps[1])} align="left" />
            <DataRow label="BRK" value={placeholderBrakeTemps[1]} type="brake" color={getBrakeColor(placeholderBrakeTemps[1])} align="left" />
          </div>
        </div>

      </div>
    </section>
  );
};

// --- COMPONENTE SINGOLE RIGHE DATI ---

interface DataRowProps {
  label: string;
  value: number;
  type: 'surf' | 'core' | 'brake';
  color: string;
  align?: 'right' | 'left';
}

const DataRow: React.FC<DataRowProps> = ({ label, value, type, color, align = 'right' }) => {
  const Icon = () => {
    // SURF: Bordo esterno colorato
    if (type === 'surf') return <div style={{width: '12px', height: '12px', borderRadius: '50%', border: `3px solid ${color}`}} />;
    // CORE: Interno riempito
    if (type === 'core') return <div style={{width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color}} />;
    // BRAKE: Croce (X)
    if (type === 'brake') return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px', borderRadius: '50%', border: `2px solid ${color}`, color: color, fontSize: '8px', fontWeight: 'bold'}}>X</div>;
    return null;
  };

  if (align === 'right') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
        <span style={{color: '#666', fontSize: '0.7rem', fontWeight: 'bold', width: '25px'}}>{label}</span>
        <span style={{color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', width: '45px', textAlign: 'right'}}>{Math.round(value)}°</span>
        <Icon />
      </div>
    );
  } else {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px' }}>
        <Icon />
        <span style={{color: '#fff', fontSize: '1.2rem', fontWeight: 'bold', width: '45px', textAlign: 'left'}}>{Math.round(value)}°</span>
        <span style={{color: '#666', fontSize: '0.7rem', fontWeight: 'bold', width: '25px'}}>{label}</span>
      </div>
    );
  }
};

// --- STILI ---

const containerStyle: React.CSSProperties = { 
  backgroundColor: '#111', 
  padding: '30px 20px', 
  borderRadius: '15px', 
  border: '1px solid #222' 
};

const layoutGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr', 
  gap: '20px',
  alignItems: 'center'
};

const dataColumnLeft: React.CSSProperties = { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '240px' };
const dataColumnRight: React.CSSProperties = { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '240px' };
const tyreDataBlock: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' };
const carWrapper: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '180px' };