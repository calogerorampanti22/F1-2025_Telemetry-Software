import React from 'react';
import type { Driver } from '../telemetry/types';
import './TimingTower.css';
import { TEAM_COLORS } from '../data/teamColors';
import { formatLapTime, formatDelta } from '../telemetry/formatters';

interface TimingTowerProps {
    drivers: Driver[];
    playerCarIndex: number;
    sessionType?: number;
}

export const TimingTower: React.FC<TimingTowerProps> = ({ drivers = [], playerCarIndex, sessionType }) => {
    const getSessionName = (type?: number) => {
        switch (type) {
            case 1: return 'FP1';
            case 2: return 'FP2';
            case 3: return 'FP3';
            case 5: return 'Q1';
            case 6: return 'Q2';
            case 7: return 'Q3';
            case 10: return 'SQ1';
            case 11: return 'SQ2';
            case 12: return 'SQ3';
            case 15: return 'RACE';
            case 18: return 'TIME TRIAL';
            default: return '---';
        }
    };

    // Filter active cars and sort by position
    const sortedDrivers = [...drivers]
        .filter(d => d && d.lapData && d.lapData.carPosition > 0 && d.lapData.carPosition <= 22)
        .sort((a, b) => (a.lapData?.carPosition || 0) - (b.lapData?.carPosition || 0));

    const formatGap = (rawMs: number, rawMins: number) => {
        if (rawMs === undefined || rawMins === undefined) return 'No Time';

        const ms = Number(rawMs) || 0;
        const mins = Number(rawMins) || 0;

        if (ms === 65535 || mins === 255) return 'No Time';

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

    const isQuali = [5, 6, 7, 10, 11, 12].includes(sessionType || 0);
    const leader = sortedDrivers[0];
    const leaderBestLap = leader?.lapData?.bestLapTimeInMS || 0;

    return (
        <div className="timing-tower-container">
            <div className="timing-tower-header">
                <h2>LEADERBOARD {getSessionName(sessionType) ? `| ${getSessionName(sessionType)}` : ''}</h2>
            </div>
            <div className="timing-tower-list">
                {sortedDrivers.map((driver, index) => {
                    const car = driver.lapData!;
                    const isPlayer = driver.carIndex === playerCarIndex;
                    const participant = driver.participant;

                    const driverName = participant && participant.name ? participant.name : `CAR ${driver.carIndex + 1}`;
                    const teamId = participant ? participant.teamId : -1;
                    const teamColor = TEAM_COLORS[teamId] || '#888888';

                    let gapStr = '';
                    let gapToFrontStr = '';

                    if (isQuali) {
                        const bestLap = car.bestLapTimeInMS || 0;
                        if (car.carPosition === 1) {
                            gapStr = bestLap > 0 ? formatLapTime(bestLap) : 'No Time';
                            gapToFrontStr = 'Interval';
                        } else {
                            if (bestLap === 0 || leaderBestLap === 0) {
                                gapStr = 'No Time';
                            } else {
                                gapStr = formatDelta(bestLap - leaderBestLap);
                            }

                            const carAhead = sortedDrivers[index - 1];
                            const aheadBestLap = carAhead?.lapData?.bestLapTimeInMS || 0;
                            if (bestLap === 0 || aheadBestLap === 0) {
                                gapToFrontStr = 'No Time';
                            } else {
                                gapToFrontStr = formatDelta(bestLap - aheadBestLap);
                            }
                        }
                    } else {
                        gapStr = car.carPosition === 1 ? 'Leader' : formatGap(car.deltaToRaceLeaderMSPart, car.deltaToRaceLeaderMinutesPart);
                        gapToFrontStr = car.carPosition === 1 ? 'Interval' : formatGap(car.deltaToCarInFrontMSPart, car.deltaToCarInFrontMinutesPart);

                        // If gapStr is missing (e.g., game doesn't provide it), we can fallback, but we now have a dedicated interval column
                        if (gapStr === 'No Time' && car.carPosition > 1 && gapToFrontStr !== 'No Time') {
                            gapStr = gapToFrontStr;
                        }
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
