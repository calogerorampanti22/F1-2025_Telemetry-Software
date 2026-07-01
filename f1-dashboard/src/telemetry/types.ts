import type { SectorDisplay } from "./formatters";

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
