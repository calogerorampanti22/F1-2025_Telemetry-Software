import React from 'react';

interface Props {
  engineTemperature: number;
  brakesTemperature: [number, number, number, number];
  tyresSurfaceTemps: [number, number, number, number];
  tyresInnerTemps: [number, number, number, number];
  tyresPressure: [number, number, number, number];
  tyresCompound: number;
  tyresAgeLaps: number;
}

// Index order: 0: RL, 1: RR, 2: FL, 3: FR

export const CarMonitor: React.FC<Props> = ({ engineTemperature, brakesTemperature, tyresSurfaceTemps, tyresInnerTemps, tyresPressure, tyresCompound, tyresAgeLaps }) => {
  const getTempColor = (temp: number) => {
    if (temp > 120) return '#ef4444';
    if (temp < 80) return '#3b82f6';
    return '#22c55e';
  };

  const getBrakeColor = (temp: number) => {
    if (temp > 800) return '#ef4444';
    if (temp < 300) return '#3b82f6';
    return '#eab308';
  };

  const getTyreIcon = (compoundId: number) => {
    switch (compoundId) {
      case 17: return '/tyresIcons/Medium Tyre.png';
      case 18: return '/tyresIcons/Hard Tyre.png';
      case 7:  return '/tyresIcons/Intermediate Tyre.png';
      case 8: return '/tyresIcons/Wet Tyre.png';
      default: return '/tyresIcons/Soft Tyre.png';
    }
  }

  return (
    <section style={containerStyle}>
      <div style={layoutGrid}>
        
        {/* COLONNA SINISTRA */}
        <div style={dataColumnLeft}>
          <div style={tyreDataBlock}>
            <DataRow label="SURF" value={tyresSurfaceTemps[2]} type="surf" color={getTempColor(tyresSurfaceTemps[2])} />
            <DataRow label="CORE" value={tyresInnerTemps[2]} type="core" color={getTempColor(tyresInnerTemps[2])} />
            <DataRow label="BRK" value={brakesTemperature[2]} type="brake" color={getBrakeColor(brakesTemperature[2])} />
            <DataRow label="PRES" value={tyresPressure[2]} type="pres" color="white" />
          </div>
          <div style={tyreDataBlock}>
            <DataRow label="SURF" value={tyresSurfaceTemps[0]} type="surf" color={getTempColor(tyresSurfaceTemps[0])} />
            <DataRow label="CORE" value={tyresInnerTemps[0]} type="core" color={getTempColor(tyresInnerTemps[0])} />
            <DataRow label="BRK" value={brakesTemperature[0]} type="brake" color={getBrakeColor(brakesTemperature[0])} />
            <DataRow label="PRES" value={tyresPressure[0]} type="pres" color="white" />
          </div>
        </div>

        {/* COLONNA CENTRALE (Macchina + Icona Gomma) */}
        <div style={centerColumn}>
          
          <div style={carWrapper}>
            <svg viewBox="0 0 200 300" style={{ width: '100%', height: 'auto' }}>
              {/* TELAIO */}
              <g fill="none" stroke="#444" strokeWidth="3" opacity="0.8">
                <path d="M 50,30 L 150,30 L 155,50 L 45,50 Z" />
                <path d="M 85,50 L 115,50 L 105,100 L 95,100 Z" />
                <path d="M 95,100 C 50,120 40,200 70,250 L 130,250 C 160,200 150,120 105,100 Z" />
                <path d="M 60,260 L 140,260 L 140,285 L 60,285 Z" />
                <ellipse cx="100" cy="130" rx="14" ry="20" />
              </g>
              {/* SOSPENSIONI */}
              <g stroke="#444" strokeWidth="2" opacity="0.6">
                <line x1="57" y1="97" x2="95" y2="85" />
                <line x1="143" y1="97" x2="105" y2="85" />
                <line x1="61" y1="232" x2="85" y2="220" />
                <line x1="139" y1="232" x2="115" y2="220" />
              </g>
              {/* MOTORE */}
              <path d="M 85,170 L 115,170 L 110,210 L 90,210 Z" fill={getTempColor(engineTemperature)} stroke="#111" strokeWidth="2" />
              <text x="100" y="160" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">{engineTemperature}°C</text>
              {/* FRENI */}
              <rect x="58" y="82" width="6" height="31" rx="2" fill={getBrakeColor(brakesTemperature[2])} />
              <rect x="136" y="82" width="6" height="31" rx="2" fill={getBrakeColor(brakesTemperature[3])} />
              <rect x="58" y="217" width="6" height="31" rx="2" fill={getBrakeColor(brakesTemperature[0])} />
              <rect x="136" y="217" width="6" height="31" rx="2" fill={getBrakeColor(brakesTemperature[1])} />
              {/* GOMME */}
              <rect x="37" y="77" width="18" height="41" rx="3" fill={getTempColor(tyresInnerTemps[2])} stroke={getTempColor(tyresSurfaceTemps[2])} strokeWidth="4" />
              <rect x="145" y="77" width="18" height="41" rx="3" fill={getTempColor(tyresInnerTemps[3])} stroke={getTempColor(tyresSurfaceTemps[3])} strokeWidth="4" />
              <rect x="37" y="212" width="18" height="41" rx="3" fill={getTempColor(tyresInnerTemps[0])} stroke={getTempColor(tyresSurfaceTemps[0])} strokeWidth="4" />
              <rect x="145" y="212" width="18" height="41" rx="3" fill={getTempColor(tyresInnerTemps[1])} stroke={getTempColor(tyresSurfaceTemps[1])} strokeWidth="4" />
            </svg>
          </div>

          {/* BADGE MESCOLA GOMMA */}
          <div style={compoundBadge}>
            <img 
              src={ getTyreIcon(tyresCompound) } 
              style={{ width: '28px', height: '28px', objectFit: 'contain' }} 
            />
            {<span style={compoundLabel}>{tyresAgeLaps} Laps</span>}
          </div>

        </div>

        {/* COLONNA DESTRA */}
        <div style={dataColumnRight}>
          <div style={tyreDataBlock}>
            <DataRow label="SURF" value={tyresSurfaceTemps[3]} type="surf" color={getTempColor(tyresSurfaceTemps[3])} align="left" />
            <DataRow label="CORE" value={tyresInnerTemps[3]} type="core" color={getTempColor(tyresInnerTemps[3])} align="left" />
            <DataRow label="BRK" value={brakesTemperature[3]} type="brake" color={getBrakeColor(brakesTemperature[3])} align="left" />
            <DataRow label="PRES" value={tyresPressure[3]} type="pres" color="white" align="left" />
          </div>
          <div style={tyreDataBlock}>
            <DataRow label="SURF" value={tyresSurfaceTemps[1]} type="surf" color={getTempColor(tyresSurfaceTemps[1])} align="left" />
            <DataRow label="CORE" value={tyresInnerTemps[1]} type="core" color={getTempColor(tyresInnerTemps[1])} align="left" />
            <DataRow label="BRK" value={brakesTemperature[1]} type="brake" color={getBrakeColor(brakesTemperature[1])} align="left" />
            <DataRow label="PRES" value={tyresPressure[1]} type="pres" color="white" align="left" />
          </div>
        </div>

      </div>
    </section>
  );
};

// --- COMPONENTE SINGOLE RIGHE DATI ---

// --- COMPONENTE SINGOLE RIGHE DATI ---

// --- COMPONENTE SINGOLE RIGHE DATI ---

interface DataRowProps {
  label: string;
  value: number;
  type: 'surf' | 'core' | 'brake' | 'pres';
  color: string;
  align?: 'right' | 'left';
}

const DataRow: React.FC<DataRowProps> = ({ label, value, type, color, align = 'right' }) => {
  const isPres = type === 'pres';
  const displayValue = isPres ? value.toFixed(1) : Math.round(value);
  const unit = isPres ? ' psi' : '°';

  // L'icona ora restituisce un quadrato trasparente di 12x12px per la pressione,
  // così la colonna dei numeri rimane perfettamente allineata verticalmente!
  const Icon = () => {
    if (type === 'surf') return <div style={{width: '12px', height: '12px', borderRadius: '50%', border: `3px solid ${color}`, flexShrink: 0}} />;
    if (type === 'core') return <div style={{width: '12px', height: '12px', borderRadius: '50%', backgroundColor: color, flexShrink: 0}} />;
    if (type === 'brake') return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '12px', height: '12px', borderRadius: '50%', border: `2px solid ${color}`, color: color, fontSize: '8px', fontWeight: 'bold', flexShrink: 0}}>X</div>;
    return <div style={{width: '12px', height: '12px', flexShrink: 0}} />; // Il "Fantasma"
  };

  // Separiamo il numero dall'unità di misura per gestirne le grandezze
  const ValueDisplay = () => (
    <div style={{ width: '65px', textAlign: align === 'right' ? 'right' : 'left', whiteSpace: 'nowrap' }}>
      <span style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 'bold' }}>{displayValue}</span>
      <span style={{ color: '#888', fontSize: '0.7rem', fontWeight: 'bold', marginLeft: '2px' }}>{unit}</span>
    </div>
  );

  if (align === 'right') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
        <span style={{color: '#666', fontSize: '0.7rem', fontWeight: 'bold', width: '30px', textAlign: 'right'}}>{label}</span>
        <ValueDisplay />
        <Icon />
      </div>
    );
  } else {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px' }}>
        <Icon />
        <ValueDisplay />
        <span style={{color: '#666', fontSize: '0.7rem', fontWeight: 'bold', width: '30px', textAlign: 'left'}}>{label}</span>
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

const dataColumnLeft: React.CSSProperties = { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '350px' };
const dataColumnRight: React.CSSProperties = { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '350px' };
const tyreDataBlock: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '8px' };

// Nuova colonna centrale per impilare SVG e Badge
const centerColumn: React.CSSProperties = { 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  gap: '20px' 
};

const carWrapper: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '180px' };

const compoundBadge: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  backgroundColor: '#1a1a1a',
  padding: '6px 16px',
  borderRadius: '20px',
  border: '1px solid #333'
};

const compoundLabel: React.CSSProperties = {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: '0.9rem',
  letterSpacing: '1px',
  textTransform: 'uppercase'
};