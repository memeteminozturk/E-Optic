const HISTORY_KEY = "examHistory";
const SESSION_KEY = "examSessionId";

// Geçmiş kayıtları: bitirilen her sınav oturumu için tek kayıt tutulur.
export function loadHistory() {
    try {
        return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    } catch {
        return [];
    }
}

function saveHistory(records) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records));
}

// Aynı sınav oturumunda cevap anahtarı yeniden düzenlenirse kayıt çoğalmasın
// diye oturum kimliği localStorage'da saklanır; yeni sınav başlayınca temizlenir.
export function getSessionId() {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
        id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        localStorage.setItem(SESSION_KEY, id);
    }
    return id;
}

export function clearSessionId() {
    localStorage.removeItem(SESSION_KEY);
}

export function upsertRecord(record) {
    const history = loadHistory();
    const index = history.findIndex((r) => r.id === record.id);
    if (index >= 0) history[index] = record;
    else history.push(record);
    saveHistory(history);
    return history;
}

export function removeRecord(id) {
    const history = loadHistory().filter((r) => r.id !== id);
    saveHistory(history);
    return history;
}

export function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
}
