import React from 'react';
import type { LapData, ParticipantData } from '../telemetry/types';
import './TimingTower.css';
import { TEAM_COLORS } from '../data/teamColors';

interface TimingTowerProps {
    allCars: LapData[];
    playerCarIndex: number;
    participants?: ParticipantData[];
}

export const TimingTower: React.FC<TimingTowerProps> = ({ allCars = [], playerCarIndex, participants = [] }) => {
    // Filter active cars and sort by position
    const sortedCars = [...allCars]
        .filter(car => car && car.carPosition > 0 && car.carPosition <= 22)
        .sort((a, b) => a.carPosition - b.carPosition);

    const formatGap = (rawMs: number, rawMins: number) => {
        if (rawMs === undefined || rawMins === undefined) return '';
        
        const ms = Number(rawMs) || 0;
        const mins = Number(rawMins) || 0;
        
        // In F1 telemetry, 65535 for uint16 and 255 for uint8 often mean "invalid" or "not set"
        if (ms === 65535 || mins === 255) return '';
        
        // Se i minuti sono esagerati (es. > 10), probabilmente c'è un disallineamento della struct (es. F1 23 vs F1 24)
        const safeMins = mins > 10 ? 0 : mins;
        
        const totalMs = (safeMins * 60000) + ms;
        if (totalMs === 0) return '';
        
        if (totalMs >= 60000) {
            const m = Math.floor(totalMs / 60000);
            const s = (totalMs % 60000) / 1000;
            // Pad seconds with leading zero if needed (e.g. 05.123)
            const sStr = s < 10 ? `0${s.toFixed(3)}` : s.toFixed(3);
            return `+${m}:${sStr}`;
        }

        return `+${(totalMs / 1000).toFixed(3)}`;
    };

    return (
        <div className="timing-tower-container">
            <div className="timing-tower-header">
                <h2>LEADERBOARD</h2>
            </div>
            <div className="timing-tower-list">
                {sortedCars.map((car) => {
                    const isPlayer = car.carIndex === playerCarIndex;
                    const participant = participants[car.carIndex];

                    const driverName = participant && participant.name ? participant.name : `CAR ${car.carIndex + 1}`;
                    const teamId = participant ? participant.teamId : -1;
                    const teamColor = TEAM_COLORS[teamId] || '#888888';

                    let gapStr = car.carPosition === 1 ? 'LEADER' : formatGap(car.deltaToRaceLeaderMSPart, car.deltaToRaceLeaderMinutesPart);
                    let gapToFrontStr = car.carPosition === 1 ? '' : formatGap(car.deltaToCarInFrontMSPart, car.deltaToCarInFrontMinutesPart);

                    // If gapStr is missing (e.g., game doesn't provide it), we can fallback, but we now have a dedicated interval column
                    if (gapStr === '' && car.carPosition > 1 && gapToFrontStr !== '') {
                        gapStr = gapToFrontStr + ' (INT)';
                    }

                    return (
                        <div key={car.carIndex} className={`timing-tower-row ${isPlayer ? 'player-row' : ''}`}>
                            <div className="position">{car.carPosition}</div>
                            <div className="team-color-bar" style={{ backgroundColor: teamColor }}></div>
                            <div className="driver-name" title={driverName}>
                                {driverName} {isPlayer && '(YOU)'}
                            </div>
                            <div className="gap" title="Gap to Leader">
                                {gapStr}
                            </div>
                            <div className="gap-front" title="Interval to car ahead">
                                {gapToFrontStr}
                            </div>
                            <div className="pits">
                                {car.numPitStops > 0 ? `${car.numPitStops} PIT` : ''}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
