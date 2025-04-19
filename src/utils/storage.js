export const TIMER_STORAGE_KEY = "timerData";

export function loadTimerData() {
    const raw = localStorage.getItem(TIMER_STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function saveTimerData(data) {
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(data));
}

export function clearTimerData() {
    localStorage.removeItem(TIMER_STORAGE_KEY);
}
