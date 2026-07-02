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
        playerCarIndex: 0
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
        lastS2: 0
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
                playerCarIndex: stateRef.current.playerCarIndex
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