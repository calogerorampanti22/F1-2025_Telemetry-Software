import { useState, useEffect, useRef } from 'react';

// Telemetry Data Interface
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

    // Car Status object
    carStatus: CarStatusData;
}

// Car Status Data Interface
export interface CarStatusData {
    tractionControl: number;
    antiLockBrakes: boolean;
    fuelMix: number;
    frontBrakeBias: number;
    pitLimiterStatus: boolean;
    fuelInTank: number;
    fuelCapacity: number;
    fuelRemainingLaps: number;
    maxRPM: number;
    idleRPM: number;
    maxGears: number;
    drsAllowed: boolean;
    drsActivationDistance: number;
    actualTyreCompound: number;
    visualTyreCompound: number;
    tyresAgeLaps: number;
    vehicleFiaFlags: number;
    enginePowerICE: number;
    enginePowerMGUK: number;
    ersStoreEnergy: number;
    ersDeployMode: number;
    ersHarvestedThisLapMGUK: number;
    ersHarvestedThisLapMGUH: number;
    ersDeployedThisLap: number;
    networkPaused: number;
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
        surfaceType: [0, 0, 0, 0],

        carStatus: {
            tractionControl: 0,
            antiLockBrakes: false,
            fuelMix: 0,
            frontBrakeBias: 0,
            pitLimiterStatus: false,
            fuelInTank: 0,
            fuelCapacity: 0,
            fuelRemainingLaps: 0,
            maxRPM: 0,
            idleRPM: 0,
            maxGears: 0,
            drsAllowed: false,
            drsActivationDistance: 0,
            actualTyreCompound: 16,
            visualTyreCompound: 16,
            tyresAgeLaps: 0,
            vehicleFiaFlags: -1,
            enginePowerICE: 0,
            enginePowerMGUK: 0,
            ersStoreEnergy: 0,
            ersDeployMode: 0,
            ersHarvestedThisLapMGUK: 0,
            ersHarvestedThisLapMGUH: 0,
            ersDeployedThisLap: 0,
            networkPaused: 0
        }
    });

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const serverIp = import.meta.env.VITE_SERVER_IP || window.location.hostname;
        wsRef.current = new WebSocket(`ws://${serverIp}:8080/telemetry`);

        wsRef.current.onopen = () => setIsConnected(true);
        wsRef.current.onclose = () => setIsConnected(false);

        wsRef.current.onmessage = (event: MessageEvent) => {
            const parsed = JSON.parse(event.data);

            // Checking if packet is correct
            if (parsed.type === 'telemetry') {
                setData(prev => ({
                    ...prev,
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
                }));
            }
            else if(parsed.type === 'carStatus') {
                setData(prev => ({
                    ...prev,
                    carStatus: {
                        tractionControl: parsed.tractionControl,
                        antiLockBrakes: parsed.antiLockBrakes,
                        fuelMix: parsed.fuelMix,
                        frontBrakeBias: parsed.frontBrakeBias,
                        pitLimiterStatus: parsed.pitLimiterStatus,
                        fuelInTank:parsed.fuelInTank,
                        fuelCapacity: parsed.fuelCapacity,
                        fuelRemainingLaps: parsed.fuelRemainingLaps,
                        maxRPM: parsed.maxRPM,
                        idleRPM: parsed.idleRPM,
                        maxGears: parsed.maxGears,
                        drsAllowed: parsed.drsAllowed,
                        drsActivationDistance: parsed.drsActivationDistance,
                        actualTyreCompound: parsed.actualTyreCompound,
                        visualTyreCompound:parsed.visualTyreCompound,
                        tyresAgeLaps: parsed.tyresAgeLaps,
                        vehicleFiaFlags: parsed.vehicleFiaFlags,
                        enginePowerICE: parsed.enginePowerICE,
                        enginePowerMGUK: parsed.enginePowerMGUK,
                        ersStoreEnergy: parsed.ersStoreEnergy,
                        ersDeployMode: parsed.ersDeployMode,
                        ersHarvestedThisLapMGUK: parsed.ersHarvestedThisLapMGUK,
                        ersHarvestedThisLapMGUH: parsed.ersHarvestedThisLapMGUH,
                        ersDeployedThisLap: parsed.ersDeployedThisLap,
                        networkPaused: parsed.networkPaused
                    }
                }));
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