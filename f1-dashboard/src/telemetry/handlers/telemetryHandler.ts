export function handleTelemetry(parsed: any, pendingRef: any) {
    pendingRef.current.speed = parsed.speed;
    pendingRef.current.throttle = parsed.throttle;
    pendingRef.current.steer = parsed.steer;
    pendingRef.current.brake = parsed.brake;
    pendingRef.current.clutch = parsed.clutch;
    pendingRef.current.gear = parsed.gear;
    pendingRef.current.engineRPM = parsed.engineRPM;
    pendingRef.current.drs = parsed.drs;
    pendingRef.current.revLightsPercent = parsed.revLightsPercent;
    pendingRef.current.revLightsBitValue = parsed.revLightsBitValue;
    pendingRef.current.engineTemperature = parsed.engineTemperature;

    pendingRef.current.brakesTemperature = parsed.brakesTemperature;
    pendingRef.current.tyresSurfaceTemperature = parsed.tyresSurfaceTemperature;
    pendingRef.current.tyresInnerTemperature = parsed.tyresInnerTemperature;
    pendingRef.current.tyresPressure = parsed.tyresPressure;
    pendingRef.current.surfaceType = parsed.surfaceType;
}