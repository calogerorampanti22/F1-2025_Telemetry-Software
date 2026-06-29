import React from 'react';
import { Timer } from 'lucide-react';
import { type LapHistoryEntry, formatLapTime, formatSectorTime } from '../hooks/useTelemetry';

const getTyreIcon = (compoundId: number): string => {
  switch (compoundId) {
    case 17: return '/tyresIcons/Medium Tyre.png';
    case 18: return '/tyresIcons/Hard Tyre.png';
    case 7: return '/tyresIcons/Intermediate Tyre.png';
    case 8: return '/tyresIcons/Wet Tyre.png';
    default: return '/tyresIcons/Soft Tyre.png';
  }
}

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
  deltaStr: string;
  sectors: [SectorDisplay, SectorDisplay, SectorDisplay];
  carPosition: number;
  lapHistory?: LapHistoryEntry[];
  compoundId: number;
  tyreAge: number;
}

export const LapTimeMonitor: React.FC<Props> = ({ currentLapTime, lastLapTime, bestLapTime, deltaStr, sectors, carPosition, lapHistory = [] }) => {

  const getSectorColor = (status: SectorDisplay['status']) => {
    switch (status) {
      case 'yellow': return '#eab308';
      case 'green': return '#22c55e';
      case 'purple': return '#a855f7';
      default: return '#222222';
    }
  };

  const validS1 = lapHistory.map(l => l.s1Ms).filter(t => t > 0);
  const validS2 = lapHistory.map(l => l.s2Ms).filter(t => t > 0);
  const validS3 = lapHistory.map(l => l.s3Ms).filter(t => t > 0);
  const validLap = lapHistory.map(l => l.lapTimeMs).filter(t => t > 0);

  const bestS1 = validS1.length > 0 ? Math.min(...validS1) : Infinity;
  const bestS2 = validS2.length > 0 ? Math.min(...validS2) : Infinity;
  const bestS3 = validS3.length > 0 ? Math.min(...validS3) : Infinity;
  const bestLap = validLap.length > 0 ? Math.min(...validLap) : Infinity;

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
        {deltaStr && (
          <span style={{
            ...deltaLabel,
            color: deltaStr.startsWith('-') ? '#22c55e' : (deltaStr.startsWith('+') ? '#ef4444' : '#555')
          }}>{deltaStr}</span>
        )}
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

      {lapHistory.length > 0 && (
        <div style={historyTableContainer}>
          <table style={historyTable}>
            <thead>
              <tr>
                <th style={tableHeader}>LAP</th>
                <th style={tableHeader}>S1</th>
                <th style={tableHeader}>S2</th>
                <th style={tableHeader}>S3</th>
                <th style={tableHeader}>TIME</th>
                <th style={tableHeader}>TYRE</th>
                <th style={{ ...tableHeader, paddingLeft: '15px' }}>AGE</th>
              </tr>
            </thead>
            <tbody>
              {lapHistory.map((lap, idx) => {
                const isBestS1 = lap.s1Ms === bestS1 && lap.s1Ms > 0;
                const isBestS2 = lap.s2Ms === bestS2 && lap.s2Ms > 0;
                const isBestS3 = lap.s3Ms === bestS3 && lap.s3Ms > 0;
                const isBestLap = lap.lapTimeMs === bestLap && lap.lapTimeMs > 0;
                return (
                  <tr key={lap.lapNum || idx} style={tableRow}>
                    <td style={{ ...tableCell, color: '#aaa' }}>{lap.lapNum}</td>
                    <td style={{ ...tableCell, color: isBestS1 ? '#a855f7' : '#ddd' }}>{formatSectorTime(lap.s1Ms) || '-'}</td>
                    <td style={{ ...tableCell, color: isBestS2 ? '#a855f7' : '#ddd' }}>{formatSectorTime(lap.s2Ms) || '-'}</td>
                    <td style={{ ...tableCell, color: isBestS3 ? '#a855f7' : '#ddd' }}>{formatSectorTime(lap.s3Ms) || '-'}</td>
                    <td style={{ ...tableCell, color: isBestLap ? '#a855f7' : '#fff', fontWeight: 'bold' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {formatLapTime(lap.lapTimeMs) || '-'}
                      </div>
                    </td>
                    <td>
                      <img
                        src={getTyreIcon(lap.compound)}
                        style={{ width: '20px', height: '20px', objectFit: 'contain', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto' }}
                      />
                    </td>
                    <td style={{ ...tableCell, color: '#aaa', paddingLeft: '15px' }}>{lap.tyreAge}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

/* --- STILI CSS (Aggiunti gli stili per i nuovi testi) --- */

const containerStyle: React.CSSProperties = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222', display: 'flex', flexDirection: 'column', minWidth: '280px' };
const sectionTitle: React.CSSProperties = { fontSize: '0.8rem', color: '#666', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' };
const currentTimeContainer: React.CSSProperties = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '8px', border: '1px solid #252525' };
const currentTimeLabel: React.CSSProperties = { fontSize: '0.65rem', color: '#555', fontWeight: 'bold', letterSpacing: '1px' };
const deltaLabel: React.CSSProperties = { fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', marginTop: '4px' };
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

const historyTableContainer: React.CSSProperties = { marginTop: '20px', maxHeight: '180px', overflowY: 'auto', borderTop: '1px solid #222', paddingTop: '15px' };
const historyTable: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.75rem' };
const tableHeader: React.CSSProperties = { color: '#666', paddingBottom: '8px', borderBottom: '1px solid #333', fontWeight: 'bold', letterSpacing: '0.5px' };
const tableRow: React.CSSProperties = { borderBottom: '1px solid #222' };
const tableCell: React.CSSProperties = { padding: '8px 4px', fontVariantNumeric: 'tabular-nums' };