import { useState, useEffect, useRef } from 'react';
import { evaluateSector, type SectorDisplay } from '../telemetry/formatters';

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
    engineTemperature: number;

    brakesTemperature: [number, number, number, number];
    tyresSurfaceTemperature: [number, number, number, number];
    tyresInnerTemperature: [number, number, number, number];
    tyresPressure: [number, number, number, number];
    surfaceType: [number, number, number, number];

    // Car Status object
    carStatus: CarStatusData;

    // Lap Data object
    lapData: LapData;

    // Session Data object
    sessionData: SessionData;
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

// Lap History Entry Interface
export interface LapHistoryEntry {
    lapNum: number;
    s1Ms: number;
    s2Ms: number;
    s3Ms: number;
    lapTimeMs: number;
    compound: number;
    tyreAge: number;
}

// Lap Data Interface
export interface LapData {
    lastLapTimeInMS: number;
    currentLapTimeInMS: number;
    sector1TimeMSPart: number;
    sector1TimeMinutesPart: number;
    sector2TimeMSPart: number;
    sector2TimeMinutesPart: number;
    deltaToCarInFrontMSPart: number;
    deltaToCarInFrontMinutesPart: number;
    deltaToRaceLeaderMSPart: number;
    deltaToRaceLeaderMinutesPart: number;
    lapDistance: number;
    totalDistance: number;
    safetyCarDelta: number;
    carPosition: number;
    currentLapNum: number;
    pitStatus: number;
    numPitStops: number;
    sector: number;
    currentLapInvalid: number;
    penalties: number;
    totalWarnings: number;
    cornerCuttingWarnings: number;
    numUnservedDriveThroughPens: number;
    numUnservedStopGoPens: number;
    gridPosition: number;
    driverStatus: number;
    resultStatus: number;
    pitLaneTimerActive: number;
    pitLaneTimeInLaneInMS: number;
    pitStopTimerInMS: number;
    pitStopShouldServePen: number;
    speedTrapFastestSpeed: number;
    speedTrapFastestLap: number;

    liveDelta: number;

    bestLapTimeInMS: number;
    sectorData: [SectorDisplay, SectorDisplay, SectorDisplay];
    lapHistory: LapHistoryEntry[];
}

// Session Data Interface
export interface SessionData {
    trackId: number;
    trackLength: number;
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
        engineTemperature: 0,
        brakesTemperature: [0, 0, 0, 0],
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
        },

        lapData: {
            lastLapTimeInMS: 0,
            currentLapTimeInMS: 0,
            sector1TimeMSPart: 0,
            sector1TimeMinutesPart: 0,
            sector2TimeMSPart: 0,
            sector2TimeMinutesPart: 0,
            deltaToCarInFrontMSPart: 0,
            deltaToCarInFrontMinutesPart: 0,
            deltaToRaceLeaderMSPart: 0,
            deltaToRaceLeaderMinutesPart: 0,
            lapDistance: 0,
            totalDistance: 0,
            safetyCarDelta: 0,
            carPosition: 0,
            currentLapNum: 0,
            pitStatus: 0,
            numPitStops: 0,
            sector: 0,
            currentLapInvalid: 0,
            penalties: 0,
            totalWarnings: 0,
            cornerCuttingWarnings: 0,
            numUnservedDriveThroughPens: 0,
            numUnservedStopGoPens: 0,
            gridPosition: 0,
            driverStatus: 0,
            resultStatus: 0,
            pitLaneTimerActive: 0,
            pitLaneTimeInLaneInMS: 0,
            pitStopTimerInMS: 0,
            pitStopShouldServePen: 0,
            speedTrapFastestSpeed: 0,
            speedTrapFastestLap: 0,

            liveDelta: 0,

            bestLapTimeInMS: 0,
            sectorData: [
                { status: 'none', timeStr: '', deltaStr: '', deltaColor: '' },
                { status: 'none', timeStr: '', deltaStr: '', deltaColor: '' },
                { status: 'none', timeStr: '', deltaStr: '', deltaColor: '' }
            ],
            lapHistory: []
        },
        sessionData: {
            trackId: -1,
            trackLength: 0
        }
    });

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const wsRef = useRef<WebSocket | null>(null);

    // CASSAFORTE DEI RECORD: Mantiene i best times senza causare re-render!
    const personalBests = useRef({
        lap: Infinity,
        s1: Infinity,
        s2: Infinity,
        s3: Infinity
    });

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
        wsRef.current = new WebSocket(`ws://localhost:8080/telemetry`);

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
                    engineTemperature: parsed.engineTemperature,
                    brakesTemperature: parsed.brakesTemperature,
                    tyresSurfaceTemperature: parsed.tyresSurfaceTemperature,
                    tyresInnerTemperature: parsed.tyresInnerTemperature,
                    tyresPressure: parsed.tyresPressure,
                    surfaceType: parsed.surfaceType
                }));
            }
            else if (parsed.type === 'carStatus') {
                trackState.current.visualTyreCompound = parsed.visualTyreCompound;
                trackState.current.tyresAgeLaps = parsed.tyresAgeLaps;
                setData(prev => ({
                    ...prev,
                    carStatus: {
                        tractionControl: parsed.tractionControl,
                        antiLockBrakes: parsed.antiLockBrakes,
                        fuelMix: parsed.fuelMix,
                        frontBrakeBias: parsed.frontBrakeBias,
                        pitLimiterStatus: parsed.pitLimiterStatus,
                        fuelInTank: parsed.fuelInTank,
                        fuelCapacity: parsed.fuelCapacity,
                        fuelRemainingLaps: parsed.fuelRemainingLaps,
                        maxRPM: parsed.maxRPM,
                        idleRPM: parsed.idleRPM,
                        maxGears: parsed.maxGears,
                        drsAllowed: parsed.drsAllowed,
                        drsActivationDistance: parsed.drsActivationDistance,
                        actualTyreCompound: parsed.actualTyreCompound,
                        visualTyreCompound: parsed.visualTyreCompound,
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
            else if (parsed.type === 'lapData') {
                const s1Time = (parsed.sector1TimeMinutesPart * 60000) + parsed.sector1TimeMSPart;
                const s2Time = (parsed.sector2TimeMinutesPart * 60000) + parsed.sector2TimeMSPart;

                // === VARIABILI COPERTINA PER IL MIGLIOR TEMPO IN GRIGLIA (IMPOSTATE A 0) ===
                const gridBestS1 = 0;
                const gridBestS2 = 0;
                const gridBestS3 = 0;

                // 1. FREEZE FRAME DI FINE GIRO
                if (trackState.current.lapNum !== -1 && parsed.currentLapNum > trackState.current.lapNum) {
                    const s3Time = parsed.lastLapTimeInMS - trackState.current.lastS1Time - trackState.current.lastS2Time;

                    // Passiamo gridBestS3 come quarto parametro
                    trackState.current.frozenS3 = evaluateSector(s3Time, personalBests.current.s3, gridBestS3);
                    trackState.current.frozenS1 = trackState.current.liveS1;
                    trackState.current.frozenS2 = trackState.current.liveS2;
                    trackState.current.holdUntil = Date.now() + 5000;

                    if (s3Time > 0 && s3Time < personalBests.current.s3) personalBests.current.s3 = s3Time;
                    trackState.current.lastS3Time = s3Time;

                    lapHistory.current.push({
                        lapNum: trackState.current.lapNum,
                        s1Ms: trackState.current.lastS1Time,
                        s2Ms: trackState.current.lastS2Time,
                        s3Ms: s3Time,
                        lapTimeMs: parsed.lastLapTimeInMS,
                        compound: trackState.current.visualTyreCompound,
                        tyreAge: trackState.current.tyresAgeLaps
                    });

                    trackState.current.liveS1 = null;
                    trackState.current.liveS2 = null;
                }

                trackState.current.lapNum = parsed.currentLapNum;

                // 2. LOGICA LIVE (Scatta solo nell'istante esatto in cui il settore viene CONCLUSO)
                const currentSector = parsed.sector;

                // Calcoliamo S1 solo se siamo entrati fisicamente in S2 (currentSector === 1) 
                // e non abbiamo ancora salvato il tempo live per questo giro
                if (currentSector === 1 && s1Time > 0 && !trackState.current.liveS1) {
                    trackState.current.liveS1 = evaluateSector(s1Time, personalBests.current.s1, gridBestS1);
                    if (s1Time < personalBests.current.s1) personalBests.current.s1 = s1Time;
                    trackState.current.lastS1Time = s1Time;
                }

                // Calcoliamo S2 solo se siamo entrati fisicamente in S3 (currentSector === 2)
                // e non abbiamo ancora salvato il tempo live per questo giro
                if (currentSector === 2 && s2Time > 0 && !trackState.current.liveS2) {
                    trackState.current.liveS2 = evaluateSector(s2Time, personalBests.current.s2, gridBestS2);
                    if (s2Time < personalBests.current.s2) personalBests.current.s2 = s2Time;
                    trackState.current.lastS2Time = s2Time;
                }

                // Record del Giro Intero (Background)
                if (parsed.lastLapTimeInMS > 0 && parsed.lastLapTimeInMS < personalBests.current.lap) {
                    personalBests.current.lap = parsed.lastLapTimeInMS;
                }

                // 3. SMISTAMENTO DEI DATI DA MOSTRARE A SCHERMO
                const emptySector: SectorDisplay = { status: 'none', timeStr: '', deltaStr: '', deltaColor: '' };
                let s1Disp = emptySector;
                let s2Disp = emptySector;
                let s3Disp = emptySector;

                if (Date.now() < trackState.current.holdUntil) {
                    // Freeze attivo a fine giro: Mostra il riepilogo bloccato
                    s1Disp = trackState.current.frozenS1 || emptySector;
                    s2Disp = trackState.current.frozenS2 || emptySector;
                    s3Disp = trackState.current.frozenS3 || emptySector;
                } else {
                    // Corsa Live: NESSUN colore mentre si percorre.
                    // Si colora (e mostra i testi) SOLO se la variabile live è stata popolata a fine settore.
                    s1Disp = trackState.current.liveS1 || emptySector;
                    s2Disp = trackState.current.liveS2 || emptySector;

                    // S3 live è sempre spento, perché il suo calcolo scatta solo 
                    // al taglio del traguardo attivando il "Freeze" qui sopra.
                    s3Disp = emptySector;
                }

                // 5. SALVATAGGIO STATO PER UI
                setData(prev => ({
                    ...prev,
                    lapData: {
                        lastLapTimeInMS: parsed.lastLapTimeInMS,
                        currentLapTimeInMS: parsed.currentLapTimeInMS,
                        sector1TimeMSPart: parsed.sector1TimeMSPart,
                        sector1TimeMinutesPart: parsed.sector1TimeMinutesPart,
                        sector2TimeMSPart: parsed.sector2TimeMSPart,
                        sector2TimeMinutesPart: parsed.sector2TimeMinutesPart,
                        deltaToCarInFrontMSPart: parsed.deltaToCarInFrontMSPart,
                        deltaToCarInFrontMinutesPart: parsed.deltaToCarInFrontMinutesPart,
                        deltaToRaceLeaderMSPart: parsed.deltaToRaceLeaderMSPart,
                        deltaToRaceLeaderMinutesPart: parsed.deltaToRaceLeaderMinutesPart,
                        lapDistance: parsed.lapDistance,
                        totalDistance: parsed.totalDistance,
                        safetyCarDelta: parsed.safetyCarDelta,
                        carPosition: parsed.carPosition,
                        currentLapNum: parsed.currentLapNum,
                        pitStatus: parsed.pitStatus,
                        numPitStops: parsed.numPitStops,
                        sector: parsed.sector,
                        currentLapInvalid: parsed.currentLapInvalid,
                        penalties: parsed.penalties,
                        totalWarnings: parsed.totalWarnings,
                        cornerCuttingWarnings: parsed.cornerCuttingWarnings,
                        numUnservedDriveThroughPens: parsed.numUnservedDriveThroughPens,
                        numUnservedStopGoPens: parsed.numUnservedStopGoPens,
                        gridPosition: parsed.gridPosition,
                        driverStatus: parsed.driverStatus,
                        resultStatus: parsed.resultStatus,
                        pitLaneTimerActive: parsed.pitLaneTimerActive,
                        pitLaneTimeInLaneInMS: parsed.pitLaneTimeInLaneInMS,
                        pitStopTimerInMS: parsed.pitStopTimerInMS,
                        pitStopShouldServePen: parsed.pitStopShouldServePen,
                        speedTrapFastestSpeed: parsed.speedTrapFastestSpeed,
                        speedTrapFastestLap: parsed.speedTrapFastestLap,

                        liveDelta: parsed.liveDelta,

                        bestLapTimeInMS: personalBests.current.lap === Infinity ? 0 : personalBests.current.lap,
                        sectorData: [s1Disp, s2Disp, s3Disp], // Sostituisce il vecchio sectorStatuses
                        lapHistory: [...lapHistory.current]
                    }
                }));
            }
            else if(parsed.type === "session") {
                setData(prev => ({
                    ...prev,
                    sessionData: {
                        trackId: parsed.trackId,
                        trackLength: parsed.trackLength
                    }
                }));
            }
        };

        // Cleanup function
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    return { data, isConnected };
}