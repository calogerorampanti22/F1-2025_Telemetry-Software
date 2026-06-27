import React from 'react';
import { Timer } from 'lucide-react';

export interface SectorDisplay {
  status: 'none' | 'yellow' | 'green' | 'purple';
  timeStr: string;
  deltaStr: string;
  deltaColor: string;
}

interface Props {
  currentLapTime: string;
  lastLapTime: string;
  bestLapTime: string;
  sectors: [SectorDisplay, SectorDisplay, SectorDisplay];
  carPosition: number;
}

export const LapTimeMonitor: React.FC<Props> = ({ currentLapTime, lastLapTime, bestLapTime, sectors, carPosition }) => {
  
  const getSectorColor = (status: SectorDisplay['status']) => {
    switch (status) {
      case 'yellow': return '#eab308';
      case 'green':  return '#22c55e';
      case 'purple': return '#a855f7';
      default:       return '#222222';
    }
  };

  return (
    <section style={containerStyle}>
      <h3 style={sectionTitle}><Timer size={18} /> LAP TIMING</h3>
      
      {/* NUOVO BLOCCO POSIZIONE */}
      <div style={posContainer}>
        <span style={posLabel}>POSITION</span>
        <span style={posValue}>{carPosition > 0 ? `#${carPosition}` : '--'}</span>
      </div>
      
      <div style={currentTimeContainer}>
        <span style={currentTimeLabel}>CURRENT</span>
        <span style={currentTimeValue}>{currentLapTime || "0:00.000"}</span>
      </div>

      <div style={sectorsRow}>
        {sectors.map((sector, index) => (
          <div key={index} style={sectorBlock}>
            <span style={sectorLabel}>S{index + 1}</span>
            <div style={{
              ...sectorIndicator,
              backgroundColor: getSectorColor(sector.status),
              boxShadow: sector.status !== 'none' ? `0 0 10px ${getSectorColor(sector.status)}40` : 'none'
            }} />
            
            {/* NUOVO BLOCCO: Mostra il tempo di settore e il delta appena disponibili */}
            <div style={sectorDataWrapper}>
              <span style={sectorTimeText}>{sector.timeStr}</span>
              <span style={{ ...sectorDeltaText, color: sector.deltaColor }}>{sector.deltaStr}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={historyRow}>
        <div style={historyBlock}>
          <span style={historyLabel}>LAST LAP</span>
          <span style={historyValue}>{lastLapTime || "--:--.---"}</span>
        </div>
        <div style={{ ...historyBlock, borderLeft: '1px solid #222', paddingLeft: '15px' }}>
          <span style={historyLabel}>BEST LAP</span>
          <span style={{ ...historyValue, color: '#a855f7' }}>{bestLapTime || "--:--.---"}</span>
        </div>
      </div>
    </section>
  );
};

/* --- STILI CSS (Aggiunti gli stili per i nuovi testi) --- */

const containerStyle: React.CSSProperties = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222', display: 'flex', flexDirection: 'column', minWidth: '280px' };
const sectionTitle: React.CSSProperties = { fontSize: '0.8rem', color: '#666', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' };
const currentTimeContainer: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '8px', border: '1px solid #252525' };
const currentTimeLabel: React.CSSProperties = { fontSize: '0.65rem', color: '#555', fontWeight: 'bold', letterSpacing: '1px' };
const currentTimeValue: React.CSSProperties = { fontSize: '2.4rem', fontWeight: 'bold', color: '#fff', fontVariantNumeric: 'tabular-nums', letterSpacing: '1px' };
const sectorsRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', gap: '15px', marginBottom: '25px' };
const sectorBlock: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' };
const sectorLabel: React.CSSProperties = { fontSize: '0.7rem', color: '#555', fontWeight: 'bold' };
const sectorIndicator: React.CSSProperties = { width: '100%', height: '8px', borderRadius: '4px', transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s' };

// Nuovi stili per Tempi e Delta per evitare che il layout "salti" quando appaiono
const sectorDataWrapper: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2px', minHeight: '28px' };
const sectorTimeText: React.CSSProperties = { fontSize: '0.85rem', color: '#fff', fontWeight: 'bold', fontVariantNumeric: 'tabular-nums' };
const sectorDeltaText: React.CSSProperties = { fontSize: '0.7rem', fontWeight: 'bold', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.5px' };

const historyRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #222', paddingTop: '15px' };
const historyBlock: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' };
const historyLabel: React.CSSProperties = { fontSize: '0.65rem', color: '#555', fontWeight: 'bold', letterSpacing: '0.5px' };
const historyValue: React.CSSProperties = { fontSize: '1.1rem', fontWeight: 'bold', color: '#eee', fontVariantNumeric: 'tabular-nums' };

const posContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
  padding: '8px 12px',
  backgroundColor: '#1a1a1a',
  borderRadius: '8px'
};

const posLabel: React.CSSProperties = { fontSize: '0.7rem', color: '#666', fontWeight: 'bold' };
const posValue: React.CSSProperties = { fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' };