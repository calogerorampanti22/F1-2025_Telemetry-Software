export interface SectorDisplay {
    status: 'none' | 'yellow' | 'green' | 'purple';
    timeStr: string;
    deltaStr: string;
    deltaColor: string;
}

// Function which returns formatted lap time (mm:ss.ms)
export const formatLapTime = (ms: number): string => {
    if (!ms || ms === 0 || ms === Infinity) return "--:--.---"; // If value is abnormal return placeholder "--.--.---"
    const minutes = Math.floor(ms / 60000); // Obtain minutes part
    const seconds = Math.floor((ms % 60000) / 1000); // Obtain seconds part
    const milliseconds = ms % 1000; // Obtain millis part
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`; // Return formatted string
};

export const formatSectorTime = (ms: number): string => {
    if (!ms || ms === 0 || ms === Infinity) return "";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    if (minutes > 0) return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
    return `${seconds}.${milliseconds.toString().padStart(3, '0')}`;
};

export const formatDelta = (ms: number): string => {
    if (ms === 0 || ms === Infinity || isNaN(ms)) return "";
    const sign = ms > 0 ? '+' : '-';
    const absMs = Math.abs(ms);
    const seconds = Math.floor(absMs / 1000);
    const milliseconds = absMs % 1000;
    return `${sign}${seconds}.${milliseconds.toString().padStart(3, '0')}`;
};

export const formatLiveDelta = (ms: number): string => {
    if (ms === Infinity || isNaN(ms)) return "";
    const sign = ms >= 0 ? '+' : '-';
    const absMs = Math.abs(ms);
    const seconds = Math.floor(absMs / 1000);
    const milliseconds = absMs % 1000;
    return `${sign}${seconds}.${milliseconds.toString().padStart(3, '0')}`;
};

// Sector Evaluator: Decide sector bar color based on other sector times
export const evaluateSector = (timeMs: number, bestMs: number, gridBestMs: number): SectorDisplay => {
    if (!timeMs || timeMs === 0) return { status: 'none', timeStr: '', deltaStr: '', deltaColor: '' };

    let status: 'none' | 'yellow' | 'green' | 'purple' = 'yellow';

    // 1. FUCSIA: Scatta SOLO se il tempo è inferiore o uguale al record della griglia
    // (Aggiungiamo il controllo gridBestMs > 0 per evitare che scatti quando è a zero)
    if (gridBestMs > 0 && timeMs <= gridBestMs) {
        status = 'purple';
    }
    // 2. VERDE: Miglioramento del proprio record personale (Personal Best)
    else if (timeMs <= bestMs || bestMs === Infinity) {
        status = 'green';
    }

    // Il delta parziale visualizzato viene calcolato rispetto al record della sessione se disponibile, altrimenti rispetto al personale
    const referenceMs = gridBestMs > 0 ? gridBestMs : bestMs;
    const deltaMs = timeMs - referenceMs;
    const deltaStr = referenceMs === Infinity ? '' : formatDelta(deltaMs);

    let deltaColor = '#eab308'; // Giallo
    if (status === 'purple') deltaColor = '#a855f7'; // Fucsia
    if (status === 'green') deltaColor = '#22c55e'; // Verde

    return {
        status,
        timeStr: formatSectorTime(timeMs),
        deltaStr,
        deltaColor
    };
};