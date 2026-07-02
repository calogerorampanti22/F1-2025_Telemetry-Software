import React, { useRef, useState, useEffect } from 'react';
import { Map } from 'lucide-react';
import { TRACK_PATHS } from '../data/trackPaths';
import type { ParticipantData } from '../telemetry/types';
import { TEAM_COLORS } from '../data/teamColors';

interface Props {
  lapDistance: number;
  trackLength: number;
  trackId: number; // Aggiungiamo l'ID per sapere quale pista caricare
  participant?: ParticipantData;
}

export const TrackProgressMap: React.FC<Props> = ({ lapDistance, trackLength, trackId, participant }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });

  // Peschiamo i dati della pista attuale
  const trackInfo = TRACK_PATHS[trackId];

  useEffect(() => {
    // Barriera di sicurezza rinforzata
    if (!pathRef.current || !trackLength || trackLength <= 0 || lapDistance === undefined || isNaN(lapDistance)) {
      return;
    }

    const path = pathRef.current;
    const svgLength = path.getTotalLength();

    // Calcolo progresso
    let progress = Math.min(Math.max(lapDistance / trackLength, 0), 1);
    if (!isFinite(progress)) return;

    // Applicazione dell'offset
    progress = (progress - (trackInfo.startOffset || 0) + 1) % 1;

    // Troviamo il punto sul percorso del file SVG reale
    const point = path.getPointAtLength(progress * svgLength);
    setDotPos({ x: point.x, y: point.y });

  }, [lapDistance, trackLength, trackId]); // Aggiunto trackId alle dipendenze

  return (
    <section style={containerStyle}>
      <h3 style={sectionTitle}><Map size={18} /> TRACK PROGRESS</h3>

      <div style={mapArea}>
        {trackInfo ? (
          <svg viewBox={trackInfo.viewBox} style={{ ...svgStyle, transform: `rotate(${trackInfo.rotation}deg)` }}>

            {/* 0. PATH AI FINI DI CALCOLO DEL PUNTO */}
            <path
              ref={pathRef}
              d={trackInfo.trackPathData}
              fill="none"
              stroke="none"
              style={{ display: 'none' }}
            />

            {/* 1. DISEGNIAMO TUTTO IL CONTENUTO DELL'SVG ORIGINALE */}
            {/* Usiamo un tag <g> per raggruppare tutto e assicurarci che mantenga gli stili */}
            <g dangerouslySetInnerHTML={{ __html: trackInfo.svgContent }} />

            {/* 2. IL PALLINO (che scorre sopra tutto) */}
            {trackLength > 0 && !isNaN(lapDistance) && (
              <circle
                cx={dotPos.x}
                cy={dotPos.y}
                r="12"
                fill={participant ? (TEAM_COLORS[participant.teamId] || '#202421ff') : '#202421ff'}
              />
            )}
          </svg>
        ) : (
          <span style={{ color: '#444' }}>IN ATTESA DI DATI...</span>
        )}
      </div>
    </section>
  );
};

/* --- STILI --- */
const containerStyle: React.CSSProperties = { backgroundColor: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #222', display: 'flex', flexDirection: 'column', minWidth: '300px', flex: 1 };
const sectionTitle: React.CSSProperties = { fontSize: '0.8rem', color: '#666', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' };
const mapArea: React.CSSProperties = { position: 'relative', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #1a1a1a', padding: '20px' };
const svgStyle: React.CSSProperties = { width: '100%', height: '100%', maxHeight: '400px' };