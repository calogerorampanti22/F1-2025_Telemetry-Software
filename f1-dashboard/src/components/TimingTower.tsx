import React from 'react';
import type { Driver } from '../telemetry/types';
import './TimingTower.css';
import { TEAM_COLORS } from '../data/teamColors';

interface TimingTowerProps {
    drivers: Driver[];
    playerCarIndex: number;
}

export const TimingTower: React.FC<TimingTowerProps> = ({ drivers = [], playerCarIndex }) => {
    // Filter active cars and sort by position
    const sortedDrivers = [...drivers]
        .filter(d => d && d.lapData && d.lapData.carPosition > 0 && d.lapData.carPosition <= 22)
        .sort((a, b) => (a.lapData?.carPosition || 0) - (b.lapData?.carPosition || 0));

    const formatGap = (rawMs: number, rawMins: number) => {
        if (rawMs === undefined || rawMins === undefined) return '';

        const ms = Number(rawMs) || 0;
        const mins = Number(rawMins) || 0;

        // RIMOSSI i controlli su 65535 e 255 che probabilmente nascondevano tempi validi!
        const totalMs = (mins * 60000) + ms;
        if (totalMs === 0) return '+0.000';

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
                {sortedDrivers.map((driver) => {
                    const car = driver.lapData!;
                    const isPlayer = driver.carIndex === playerCarIndex;
                    const participant = driver.participant;

                    const driverName = participant && participant.name ? participant.name : `CAR ${driver.carIndex + 1}`;
                    const teamId = participant ? participant.teamId : -1;
                    const teamColor = TEAM_COLORS[teamId] || '#888888';

                    let gapStr = car.carPosition === 1 ? 'Leader' : formatGap(car.deltaToRaceLeaderMSPart, car.deltaToRaceLeaderMinutesPart);
                    let gapToFrontStr = car.carPosition === 1 ? 'Interval' : formatGap(car.deltaToCarInFrontMSPart, car.deltaToCarInFrontMinutesPart);

                    // If gapStr is missing (e.g., game doesn't provide it), we can fallback, but we now have a dedicated interval column
                    if (gapStr === '' && car.carPosition > 1 && gapToFrontStr !== '') {
                        gapStr = gapToFrontStr;
                    }

                    return (
                        <div key={driver.carIndex} className={`timing-tower-row ${isPlayer ? 'player-row' : ''}`}>
                            <div className="position">{car.carPosition}</div>
                            <div className="team-color-bar" style={{ backgroundColor: teamColor }}></div>
                            <div className="driver-name" title={driverName}>
                                {driverName} {isPlayer}
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
