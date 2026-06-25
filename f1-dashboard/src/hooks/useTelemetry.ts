import { useState, useEffect, useRef } from 'react';

// Telemetry Interface
export interface TelemetryData {
    speed: number;
    throttle: number;
    steer: number;
    brake: number;
    clutch: number;
    gear: number;
    engineRPM: number;
    drs: boolean;
    revLightsPercent: number;
    revLightsBitValue: number;

    tyresSurfaceTemperature: [number, number, number, number];
    tyresInnerTemperature: [number, number, number, number];
    tyresPressure: [number, number, number, number];
    surfaceType: [number, number, number, number];
}

export function useTelemetry() {
    // Initializating the state with safe default value to avoid crash at first render
    const [data, setData] = useState<TelemetryData>({
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
        tyresSurfaceTemperature: [0, 0, 0, 0],
        tyresInnerTemperature: [0, 0, 0, 0],
        tyresPressure: [0, 0, 0, 0],
        surfaceType: [0, 0, 0, 0]
    });

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const serverIp = window.location.hostname;
        wsRef.current = new WebSocket(`ws://${serverIp}:8080/telemetry`);

        wsRef.current.onopen = () => setIsConnected(true);
        wsRef.current.onclose = () => setIsConnected(false);

        wsRef.current.onmessage = (event: MessageEvent) => {
            const parsed = JSON.parse(event.data);

            // Checking if packet is correct
            if (parsed.type === 'telemetry') {
                setData({
                speed: parsed.speed,
                throttle: parsed.throttle,
                steer: parsed.steer,
                brake: parsed.brake,
                clutch: parsed.clutch,
                gear: parsed.gear,
                engineRPM: parsed.engineRPM,
                drs: parsed.drs,
                revLightsPercent: parsed.revLightsPercent,
                revLightsBitValue: parsed.revLightsBitValue,
                tyresSurfaceTemperature: parsed.tyresSurfaceTemperature,
                tyresInnerTemperature: parsed.tyresInnerTemperature,
                tyresPressure: parsed.tyresPressure,
                surfaceType: parsed.surfaceType
                });
            }
        };

        // Cleanup function
        return () => {
            if(wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    return { data, isConnected };
}