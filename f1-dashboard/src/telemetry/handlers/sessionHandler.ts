export function handleSession (parsed: any, pendingRef: any) {
    pendingRef.current.sessionData = {
        trackId: parsed.trackId,
        trackLength: parsed.trackLength
    };
}