import React from 'react';
import { Activity } from 'lucide-react';

interface Props {
  connected: boolean;
}

export const StatusHeader: React.FC<Props> = ({ connected }) => {
  return (
    <header style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Activity size={24} color={connected ? '#4ade80' : '#f87171'} />
        <h1 style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '1px' }}>F1 25 LIVE TELEMETRY</h1>
      </div>
      <div style={{ color: connected ? '#4ade80' : '#f87171', fontSize: '0.9rem', fontWeight: 'bold' }}>
        {connected ? 'BACKEND ONLINE' : 'DISCONNECTED'}
      </div>
    </header>
  );
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #222',
  paddingBottom: '15px',
  marginBottom: '30px',
};