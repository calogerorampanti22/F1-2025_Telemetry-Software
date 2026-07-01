export function handleCarStatus(parsed: any, trackState: any, pendingRef: any) {
    trackState.current.visualTyreCompound = parsed.visualTyreCompound;
    trackState.current.tyresAgeLaps = parsed.tyresAgeLaps;

    pendingRef.current.carStatus = {
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
    };
}