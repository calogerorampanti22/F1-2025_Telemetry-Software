import { evaluateSector } from '../formatters';

export function handleLapData(
    parsed: any,
    trackState: any,
    personalBests: any,
    sessionBests: any,
    gridCarsState: any,
    lapHistory: any,
    pendingRef: any
) {
    const cars = parsed.cars;
    const playerCarIndex = parsed.playerCarIndex;

    let playerLap: any = null;

    if (cars && cars.length > 0) {
        playerLap = cars[playerCarIndex];
        pendingRef.current.allCarsLapData = cars;

        // Safely initialize sessionBests if corrupted by Fast Refresh
        if (!sessionBests.current || typeof sessionBests.current.s1 !== 'number') {
            sessionBests.current = { s1: Infinity, s2: Infinity, s3: Infinity };
        }

        // Safely initialize gridCarsState if corrupted by Fast Refresh
        if (!Array.isArray(gridCarsState.current) || gridCarsState.current.length < cars.length) {
            gridCarsState.current = new Array(22).fill(null).map(() => ({ lapNum: -1, lastS1: 0, lastS2: 0 }));
        }

        // Calculate session bests from all cars
        for (let i = 0; i < cars.length; i++) {
            const car = cars[i];
            const state = gridCarsState.current[i];
            if (!state) continue;

            const s1 = (car.sector1TimeMinutesPart || 0) * 60000 + (car.sector1TimeMSPart || 0);
            const s2 = (car.sector2TimeMinutesPart || 0) * 60000 + (car.sector2TimeMSPart || 0);

            // Live S1 update for grid
            if (car.sector === 1 && s1 > 0) {
                state.lastS1 = s1;
                if (s1 < sessionBests.current.s1) sessionBests.current.s1 = s1;
            }
            
            // Live S2 update for grid
            if (car.sector === 2 && s2 > 0) {
                state.lastS2 = s2;
                if (s2 < sessionBests.current.s2) sessionBests.current.s2 = s2;
            }

            // Lap finished -> calculate S3
            if (state.lapNum !== -1 && car.currentLapNum > state.lapNum) {
                if (car.lastLapTimeInMS > 0 && state.lastS1 > 0 && state.lastS2 > 0) {
                    const s3 = car.lastLapTimeInMS - state.lastS1 - state.lastS2;
                    if (s3 > 0 && s3 < sessionBests.current.s3) {
                        sessionBests.current.s3 = s3;
                    }
                }
                // Reset sectors for new lap
                state.lastS1 = 0;
                state.lastS2 = 0;
            }
            
            state.lapNum = car.currentLapNum;
        }
    } else {
        // Fallback for old parser executable
        playerLap = parsed;
        pendingRef.current.allCarsLapData = [parsed];
    }

    if (!playerLap) return;

    const s1Time =
        playerLap.sector1TimeMinutesPart * 60000 +
        playerLap.sector1TimeMSPart;

    const s2Time =
        playerLap.sector2TimeMinutesPart * 60000 +
        playerLap.sector2TimeMSPart;

    const gridBestS1 = sessionBests.current.s1 === Infinity ? 0 : sessionBests.current.s1;
    const gridBestS2 = sessionBests.current.s2 === Infinity ? 0 : sessionBests.current.s2;
    const gridBestS3 = sessionBests.current.s3 === Infinity ? 0 : sessionBests.current.s3;

    // =========================
    // FINE GIRO → CALCOLO S3 + FREEZE
    // =========================
    if (
        trackState.current.lapNum !== -1 &&
        playerLap.currentLapNum > trackState.current.lapNum
    ) {
        const s3Time =
            playerLap.lastLapTimeInMS -
            trackState.current.lastS1Time -
            trackState.current.lastS2Time;

        const s3Display = evaluateSector(
            s3Time,
            personalBests.current.s3,
            gridBestS3
        );

        trackState.current.frozenS1 = trackState.current.liveS1;
        trackState.current.frozenS2 = trackState.current.liveS2;
        trackState.current.frozenS3 = s3Display;

        trackState.current.holdUntil = Date.now() + 5000;

        lapHistory.current.push({
            lapNum: trackState.current.lapNum,
            s1Ms: trackState.current.lastS1Time,
            s2Ms: trackState.current.lastS2Time,
            s3Ms: s3Time,
            lapTimeMs: playerLap.lastLapTimeInMS,
            compound: trackState.current.visualTyreCompound,
            tyreAge: trackState.current.tyresAgeLaps
        });

        trackState.current.liveS1 = null;
        trackState.current.liveS2 = null;

        if (s3Time > 0 && s3Time < personalBests.current.s3) {
            personalBests.current.s3 = s3Time;
        }
    }

    trackState.current.lapNum = playerLap.currentLapNum;

    const currentSector = playerLap.sector;

    // =========================
    // LIVE S1
    // =========================
    if (currentSector === 1 && s1Time > 0 && !trackState.current.liveS1) {
        trackState.current.liveS1 = evaluateSector(
            s1Time,
            personalBests.current.s1,
            gridBestS1
        );

        if (s1Time < personalBests.current.s1) {
            personalBests.current.s1 = s1Time;
        }

        trackState.current.lastS1Time = s1Time;
    }

    // =========================
    // LIVE S2
    // =========================
    if (currentSector === 2 && s2Time > 0 && !trackState.current.liveS2) {
        trackState.current.liveS2 = evaluateSector(
            s2Time,
            personalBests.current.s2,
            gridBestS2
        );

        if (s2Time < personalBests.current.s2) {
            personalBests.current.s2 = s2Time;
        }

        trackState.current.lastS2Time = s2Time;
    }

    // =========================
    // OUTPUT UI STABILE (NO FLICKER)
    // =========================

    const empty = {
        status: 'none',
        timeStr: '',
        deltaStr: '',
        deltaColor: ''
    };

    const isFrozen = Date.now() < trackState.current.holdUntil;

    const liveS1 = trackState.current.liveS1 || empty;
    const liveS2 = trackState.current.liveS2 || empty;

    const s1 = isFrozen
        ? trackState.current.frozenS1 || liveS1
        : liveS1;

    const s2 = isFrozen
        ? trackState.current.frozenS2 || liveS2
        : liveS2;

    const s3 = isFrozen
        ? trackState.current.frozenS3 || empty
        : empty;

    pendingRef.current.lapData = {
        ...playerLap,
        bestLapTimeInMS:
            personalBests.current.lap === Infinity
                ? 0
                : personalBests.current.lap,
        sectorData: [s1, s2, s3],
        lapHistory: [...lapHistory.current]
    };

    // =========================
    // BEST LAP UPDATE
    // =========================
    if (
        playerLap.lastLapTimeInMS > 0 &&
        playerLap.lastLapTimeInMS < personalBests.current.lap
    ) {
        personalBests.current.lap = playerLap.lastLapTimeInMS;
    }
}