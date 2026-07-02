import { useState, useEffect, useRef } from 'react';
import { type SectorDisplay } from '../telemetry/formatters';

import { handleTelemetry } from '../telemetry/handlers/telemetryHandler';
import { handleCarStatus } from '../telemetry/handlers/carStatusHandler';
import { handleLapData } from '../telemetry/handlers/lapDataHandler';
import { handleSession } from '../telemetry/handlers/sessionHandler';

import type {
    AppState,
    SessionData,
    LapHistoryEntry
} from '../telemetry/types';

export function useTelemetry() {
    // Initial global state
    const [state, setState] = useState<AppState>(() => ({
        drivers: Array.from({ length: 22 }, (_, i) => ({ carIndex: i })),
        sessionData: {} as SessionData,
        playerCarIndex: 0,
        sessionBests: { s1: Infinity, s2: Infinity, s3: Infinity },
        personalBests: { s1: Infinity, s2: Infinity, s3: Infinity, lap: Infinity }
    }));

    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);

    // Persistent reference to the current state for handlers to mutate
    const stateRef = useRef<AppState>({
        drivers: Array.from({ length: 22 }, (_, i) => ({ carIndex: i })),
        sessionData: {} as SessionData,
        playerCarIndex: 0
    });

    const personalBests = useRef({
        lap: Infinity,
        s1: Infinity,
        s2: Infinity,
        s3: Infinity
    });

    const sessionBests = useRef({
        s1: Infinity,
        s2: Infinity,
        s3: Infinity
    });

    const gridCarsState = useRef(new Array(22).fill(null).map(() => ({
        lapNum: -1,
        lastS1: 0,
        lastS2: 0,
        bestLap: 0
    })));

    const lapHistory = useRef<LapHistoryEntry[]>([]);

    const trackState = useRef({
        lapNum: -1,
        liveS1: null as SectorDisplay | null,
        liveS2: null as SectorDisplay | null,
        frozenS1: null as SectorDisplay | null,
        frozenS2: null as SectorDisplay | null,
        frozenS3: null as SectorDisplay | null,
        holdUntil: 0,
        lastS1Time: Infinity,
        lastS2Time: Infinity,
        lastS3Time: Infinity,
        visualTyreCompound: 16,
        tyresAgeLaps: 0
    });

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080/telemetry");
        wsRef.current = ws;

        let animationFrameId: number | null = null;
        let hasPendingChanges = false;

        const flush = () => {
            if (!hasPendingChanges) return;
            hasPendingChanges = false;

            setState({
                drivers: [...stateRef.current.drivers],
                sessionData: { ...stateRef.current.sessionData },
                playerCarIndex: stateRef.current.playerCarIndex,
                sessionBests: { ...sessionBests.current },
                personalBests: { ...personalBests.current }
            });
        };

        const scheduleFlush = () => {
            hasPendingChanges = true;
            if (animationFrameId) return;

            animationFrameId = requestAnimationFrame(() => {
                animationFrameId = null;
                flush();
            });
        };

        ws.onopen = () => setIsConnected(true);
        ws.onclose = () => setIsConnected(false);
        ws.onerror = () => setIsConnected(false);

        ws.onmessage = (event) => {
            const parsed = JSON.parse(event.data);

            switch (parsed.type) {
                case 'telemetry':
                    handleTelemetry(parsed, stateRef);
                    break;

                case 'carStatus':
                    handleCarStatus(parsed, trackState, stateRef);
                    break;

                case 'lapData':
                    handleLapData(parsed, trackState, personalBests, sessionBests, gridCarsState, lapHistory, stateRef);
                    break;

                case 'session':
                    const prevSessionType = stateRef.current.sessionData?.sessionType;
                    const newSessionType = parsed.sessionType;
                    
                    if (prevSessionType !== undefined && prevSessionType !== newSessionType) {
                        // Reset session stats on session change (e.g. Q2 -> Q3)
                        personalBests.current = { lap: Infinity, s1: Infinity, s2: Infinity, s3: Infinity };
                        sessionBests.current = { s1: Infinity, s2: Infinity, s3: Infinity };
                        lapHistory.current = [];
                        
                        gridCarsState.current = new Array(22).fill(null).map(() => ({
                            lapNum: -1, lastS1: 0, lastS2: 0, bestLap: 0
                        }));
                        
                        trackState.current = {
                            lapNum: -1,
                            liveS1: null, liveS2: null,
                            frozenS1: null, frozenS2: null, frozenS3: null,
                            holdUntil: 0,
                            lastS1Time: Infinity, lastS2Time: Infinity, lastS3Time: Infinity,
                            visualTyreCompound: 16, tyresAgeLaps: 0
                        };
                        
                        // Clear lapData bests inside drivers array
                        for (let i = 0; i < stateRef.current.drivers.length; i++) {
                            const driver = stateRef.current.drivers[i];
                            if (driver && driver.lapData) {
                                driver.lapData.lapHistory = [];
                                driver.lapData.bestLapTimeInMS = 0;
                                driver.lapData.sectorData = [
                                    { status: 'none', timeStr: '', deltaStr: '', deltaColor: '' },
                                    { status: 'none', timeStr: '', deltaStr: '', deltaColor: '' },
                                    { status: 'none', timeStr: '', deltaStr: '', deltaColor: '' }
                                ];
                            }
                        }
                    }
                    
                    handleSession(parsed, stateRef);
                    break;

                case 'participants':
                    // Update participants in drivers array
                    const drivers = parsed.drivers || [];
                    for (let i = 0; i < drivers.length; i++) {
                        if (stateRef.current.drivers[i]) {
                            stateRef.current.drivers[i].participant = drivers[i];
                        }
                    }
                    break;
                case 'sessionHistory':
                    const idx = parsed.carIdx;
                    if (stateRef.current.drivers[idx] && stateRef.current.drivers[idx].lapData) {
                        // If the backend has a best lap (nonzero) we prefer it as it's official and covers historical laps.
                        if (parsed.bestLapTimeInMS > 0) {
                            stateRef.current.drivers[idx].lapData!.bestLapTimeInMS = parsed.bestLapTimeInMS;
                            // Also update gridCarsState so lapDataHandler doesn't overwrite it incorrectly
                            if (gridCarsState.current[idx]) {
                                gridCarsState.current[idx].bestLap = parsed.bestLapTimeInMS;
                            }
                        }
                    }
                    break;
            }

            scheduleFlush();
        };

        return () => {
            ws.close();
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return { state, isConnected };
}