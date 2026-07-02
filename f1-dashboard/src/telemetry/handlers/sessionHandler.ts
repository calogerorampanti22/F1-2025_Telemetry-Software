export function handleSession(parsed: any, stateRef: any) {
    stateRef.current.sessionData = {
        trackId: parsed.trackId,
        trackLength: parsed.trackLength,
        sessionType: parsed.sessionType
    };
}