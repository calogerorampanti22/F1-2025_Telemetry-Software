export function handleTelemetry(parsed: any, stateRef: any) {
    const playerIndex = stateRef.current.playerCarIndex ?? 0;
    if (!stateRef.current.drivers[playerIndex]) return;

    stateRef.current.drivers[playerIndex].telemetry = {
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
    };
}