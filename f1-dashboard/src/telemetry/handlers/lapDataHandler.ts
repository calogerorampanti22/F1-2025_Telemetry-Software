import { evaluateSector } from '../formatters';

export function handleLapData(
    parsed: any,
    trackState: any,
    personalBests: any,
    lapHistory: any,
    pendingRef: any
) {
    const s1Time =
        parsed.sector1TimeMinutesPart * 60000 +
        parsed.sector1TimeMSPart;

    const s2Time =
        parsed.sector2TimeMinutesPart * 60000 +
        parsed.sector2TimeMSPart;

    const gridBestS1 = 0;
    const gridBestS2 = 0;
    const gridBestS3 = 0;

    // =========================
    // FINE GIRO → CALCOLO S3 + FREEZE
    // =========================
    if (
        trackState.current.lapNum !== -1 &&
        parsed.currentLapNum > trackState.current.lapNum
    ) {
        const s3Time =
            parsed.lastLapTimeInMS -
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
            lapTimeMs: parsed.lastLapTimeInMS,
            compound: trackState.current.visualTyreCompound,
            tyreAge: trackState.current.tyresAgeLaps
        });

        trackState.current.liveS1 = null;
        trackState.current.liveS2 = null;

        if (s3Time < personalBests.current.s3) {
            personalBests.current.s3 = s3Time;
        }
    }

    trackState.current.lapNum = parsed.currentLapNum;

    const currentSector = parsed.sector;

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
        ...parsed,
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
        parsed.lastLapTimeInMS > 0 &&
        parsed.lastLapTimeInMS < personalBests.current.lap
    ) {
        personalBests.current.lap = parsed.lastLapTimeInMS;
    }
}