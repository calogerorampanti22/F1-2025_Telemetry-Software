import { useState, useEffect, useRef } from 'react';
import { type SectorDisplay } from '../telemetry/formatters';

import { handleTelemetry } from '../telemetry/handlers/telemetryHandler';
import { handleCarStatus } from '../telemetry/handlers/carStatusHandler';
import { handleLapData } from '../telemetry/handlers/lapDataHandler';
import { handleSession } from '../telemetry/handlers/sessionHandler';

import type {
    TelemetryData,
    CarStatusData,
    LapData,
    SessionData,
    LapHistoryEntry
} from '../telemetry/types';

export function useTelemetry() {
    const [data, setData] = useState<TelemetryData>(() => ({
        speed: 0,
        throttle: 0,
        steer: 0,
        brake: 0,
        clutch: 0,
        gear: 0,
        engineRPM: 0,
        drs: false,
        revLightsPercent: 0,
        revLightsBitValue: 0,
        engineTemperature: 0,

        brakesTemperature: [0, 0, 0, 0],
        tyresSurfaceTemperature: [0, 0, 0, 0],
        tyresInnerTemperature: [0, 0, 0, 0],
        tyresPressure: [0, 0, 0, 0],
        surfaceType: [0, 0, 0, 0],

        carStatus: {} as CarStatusData,
        lapData: {} as LapData,
        allCarsLapData: [],
        sessionData: {} as SessionData,
        participants: []
    }));

    const [isConnected, setIsConnected] = useState(false);

    const wsRef = useRef<WebSocket | null>(null);

    // buffer realtime
    const pendingRef = useRef<Partial<TelemetryData>>({});

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

        const flush = () => {
            setData(prev => {
                // evita update inutile
                if (Object.keys(pendingRef.current).length === 0) {
                    return prev;
                }

                const next = {
                    ...prev,
                    ...pendingRef.current
                };

                pendingRef.current = {};
                return next;
            });
        };

        const scheduleFlush = () => {
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
                    handleTelemetry(parsed, pendingRef);
                    break;

                case 'carStatus':
                    handleCarStatus(parsed, trackState, pendingRef);
                    break;

                case 'lapData':
                    handleLapData(parsed, trackState, personalBests, sessionBests, gridCarsState, lapHistory, pendingRef);
                    break;

                case 'session':
                    handleSession(parsed, pendingRef);
                    break;

                case 'participants':
                    pendingRef.current.participants = parsed.drivers;
                    break;
            }

            scheduleFlush();
        };

        return () => {
            ws.close();
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return { data, isConnected };
}