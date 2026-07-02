import React from 'react';
import { Timer } from 'lucide-react';
import { type LapHistoryEntry } from '../telemetry/types';
import { formatLapTime, formatSectorTime } from '../telemetry/formatters';

const getTyreIcon = (compoundId: number): string => {
  switch (compoundId) {
    case 17:
      return '/tyresIcons/Medium Tyre.png';
    case 18:
      return '/tyresIcons/Hard Tyre.png';
    case 7:
      return '/tyresIcons/Intermediate Tyre.png';
    case 8:
      return '/tyresIcons/Wet Tyre.png';
    default:
      return '/tyresIcons/Soft Tyre.png';
  }
};

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
  sessionBests?: { s1: number, s2: number, s3: number };
  personalBests?: { s1: number, s2: number, s3: number, lap: number };
  globalBestLapTimeMs?: number;
}

export const LapTimeMonitor: React.FC<Props> = ({
  currentLapTime,
  lastLapTime,
  bestLapTime,
  deltaStr,
  sectors,
  carPosition,
  lapHistory,
  sessionBests,
  personalBests,
  globalBestLapTimeMs
}) => {
  // 🔐 SAFETY: evita crash se undefined
  const safeHistory: LapHistoryEntry[] = lapHistory ?? [];

  const getSectorColor = (status: SectorDisplay['status']) => {
    switch (status) {
      case 'yellow':
        return '#eab308';
      case 'green':
        return '#22c55e';
      case 'purple':
        return '#a855f7';
      default:
        return '#222222';
    }
  };

  const safeSectors = sectors ?? [];

  return (
    <section style={containerStyle}>
      <h3 style={sectionTitle}>
        <Timer size={18} /> LAP TIMING
      </h3>

      {/* POSITION */}
      <div style={posContainer}>
        <span style={posLabel}>POSITION</span>
        <span style={posValue}>{carPosition > 0 ? `#${carPosition}` : '--'}</span>
      </div>

      {/* CURRENT LAP */}
      <div style={currentTimeContainer}>
        <span style={currentTimeLabel}>CURRENT</span>
        <span style={currentTimeValue}>{currentLapTime || '0:00.000'}</span>

        {deltaStr && (
          <span
            style={{
              ...deltaLabel,
              color: deltaStr.startsWith('-')
                ? '#22c55e'
                : deltaStr.startsWith('+')
                  ? '#ef4444'
                  : '#555'
            }}
          >
            {deltaStr}
          </span>
        )}
      </div>

      {/* SECTORS */}
      <div style={sectorsRow}>
        {safeSectors.map((sector, index) => (
          <div key={index} style={sectorBlock}>
            <span style={sectorLabel}>S{index + 1}</span>

            <div
              style={{
                ...sectorIndicator,
                backgroundColor: getSectorColor(sector.status),
                boxShadow:
                  sector.status !== 'none'
                    ? `0 0 10px ${getSectorColor(sector.status)}40`
                    : 'none'
              }}
            />

            <div style={sectorDataWrapper}>
              <span style={sectorTimeText}>{sector.timeStr}</span>
              <span style={{ ...sectorDeltaText, color: sector.deltaColor }}>
                {sector.deltaStr}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* LAST / BEST */}
      <div style={historyRow}>
        <div style={historyBlock}>
          <span style={historyLabel}>LAST LAP</span>
          <span style={historyValue}>{lastLapTime || '--:--.---'}</span>
        </div>

        <div
          style={{
            ...historyBlock,
            borderLeft: '1px solid #222',
            paddingLeft: '15px'
          }}
        >
          <span style={historyLabel}>BEST LAP</span>
          <span style={{ ...historyValue, color: '#a855f7' }}>
            {bestLapTime || '--:--.---'}
          </span>
        </div>
      </div>

      {/* HISTORY TABLE */}
      {safeHistory.length > 0 && (
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
              {safeHistory.map((lap, idx) => {
                const sBests = sessionBests || { s1: Infinity, s2: Infinity, s3: Infinity };
                const pBests = personalBests || { s1: Infinity, s2: Infinity, s3: Infinity, lap: Infinity };

                const isPurpleS1 = lap.s1Ms > 0 && lap.s1Ms <= sBests.s1;
                const isGreenS1 = lap.s1Ms > 0 && !isPurpleS1 && lap.s1Ms <= pBests.s1;

                const isPurpleS2 = lap.s2Ms > 0 && lap.s2Ms <= sBests.s2;
                const isGreenS2 = lap.s2Ms > 0 && !isPurpleS2 && lap.s2Ms <= pBests.s2;

                const isPurpleS3 = lap.s3Ms > 0 && lap.s3Ms <= sBests.s3;
                const isGreenS3 = lap.s3Ms > 0 && !isPurpleS3 && lap.s3Ms <= pBests.s3;

                const gBestLap = globalBestLapTimeMs !== undefined ? globalBestLapTimeMs : Infinity;
                const isPurpleLap = lap.lapTimeMs > 0 && lap.lapTimeMs <= gBestLap;
                const isGreenLap = lap.lapTimeMs > 0 && !isPurpleLap && lap.lapTimeMs <= pBests.lap;

                return (
                  <tr key={lap.lapNum || idx} style={tableRow}>
                    <td style={{ ...tableCell, color: '#aaa' }}>
                      {lap.lapNum}
                    </td>

                    <td
                      style={{
                        ...tableCell,
                        color: isPurpleS1 ? '#a855f7' : isGreenS1 ? '#22c55e' : '#ddd'
                      }}
                    >
                      {formatSectorTime(lap.s1Ms) || '-'}
                    </td>

                    <td
                      style={{
                        ...tableCell,
                        color: isPurpleS2 ? '#a855f7' : isGreenS2 ? '#22c55e' : '#ddd'
                      }}
                    >
                      {formatSectorTime(lap.s2Ms) || '-'}
                    </td>

                    <td
                      style={{
                        ...tableCell,
                        color: isPurpleS3 ? '#a855f7' : isGreenS3 ? '#22c55e' : '#ddd'
                      }}
                    >
                      {formatSectorTime(lap.s3Ms) || '-'}
                    </td>

                    <td
                      style={{
                        ...tableCell,
                        color: isPurpleLap ? '#a855f7' : isGreenLap ? '#22c55e' : '#fff',
                        fontWeight: 'bold'
                      }}
                    >
                      {formatLapTime(lap.lapTimeMs) || '-'}
                    </td>

                    <td>
                      <img
                        src={getTyreIcon(lap.compound)}
                        style={{
                          width: '20px',
                          height: '20px',
                          objectFit: 'contain',
                          margin: 'auto',
                          display: 'block'
                        }}
                      />
                    </td>

                    <td style={{ ...tableCell, color: '#aaa', paddingLeft: '15px' }}>
                      {lap.tyreAge}
                    </td>
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

/* ================= STYLES ================= */

const containerStyle: React.CSSProperties = {
  backgroundColor: '#111',
  padding: '20px',
  borderRadius: '15px',
  border: '1px solid #222',
  display: 'flex',
  flexDirection: 'column',
  minWidth: '280px'
};

const sectionTitle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#666',
  marginBottom: '15px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const currentTimeContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '20px',
  backgroundColor: '#1a1a1a',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #252525'
};

const currentTimeLabel: React.CSSProperties = {
  fontSize: '0.65rem',
  color: '#555',
  fontWeight: 'bold',
  letterSpacing: '1px'
};

const deltaLabel: React.CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 'bold',
  marginTop: '4px'
};

const currentTimeValue: React.CSSProperties = {
  fontSize: '2.4rem',
  fontWeight: 'bold',
  color: '#fff',
  fontVariantNumeric: 'tabular-nums'
};

const sectorsRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '15px',
  marginBottom: '25px'
};

const sectorBlock: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px'
};

const sectorLabel: React.CSSProperties = {
  fontSize: '0.7rem',
  color: '#555',
  fontWeight: 'bold'
};

const sectorIndicator: React.CSSProperties = {
  width: '100%',
  height: '8px',
  borderRadius: '4px'
};

const sectorDataWrapper: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '28px'
};

const sectorTimeText: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#fff',
  fontWeight: 'bold'
};

const sectorDeltaText: React.CSSProperties = {
  fontSize: '0.7rem',
  fontWeight: 'bold'
};

const historyRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  borderTop: '1px solid #222',
  paddingTop: '15px'
};

const historyBlock: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const historyLabel: React.CSSProperties = {
  fontSize: '0.65rem',
  color: '#555',
  fontWeight: 'bold'
};

const historyValue: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#eee'
};

const posContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '15px',
  padding: '8px 12px',
  backgroundColor: '#1a1a1a',
  borderRadius: '8px'
};

const posLabel: React.CSSProperties = { fontSize: '0.7rem', color: '#666' };
const posValue: React.CSSProperties = { fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' };

const historyTableContainer: React.CSSProperties = {
  marginTop: '20px',
  maxHeight: '180px',
  overflowY: 'auto',
  borderTop: '1px solid #222',
  paddingTop: '15px'
};

const historyTable: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'center',
  fontSize: '0.75rem'
};

const tableHeader: React.CSSProperties = {
  color: '#666',
  paddingBottom: '8px',
  borderBottom: '1px solid #333',
  fontWeight: 'bold'
};

const tableRow: React.CSSProperties = {
  borderBottom: '1px solid #222'
};

const tableCell: React.CSSProperties = {
  padding: '8px 4px',
  fontVariantNumeric: 'tabular-nums'
};