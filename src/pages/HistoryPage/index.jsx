import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList,
  faTrash,
  faChartLine,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { loadHistory, removeRecord, clearHistory } from "../../utils/history";
import NetTrendChart from "./NetTrendChart";
import "./style.css";

const fmtNet = (n) => n.toLocaleString("tr-TR", { maximumFractionDigits: 2 });

const fmtDateTime = (iso) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })} ${d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;
};

const HistoryPage = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState(loadHistory);
  const [selectedName, setSelectedName] = useState(null);

  useEffect(() => {
    document.title = "Sanal Optik - Geçmiş";
  }, []);

  // Yeniden eskiye sıralı kayıtlar
  const sorted = useMemo(
    () => [...history].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [history]
  );

  // Sınav adına göre kayıt sayıları (en son çözülen önce)
  const examNames = useMemo(() => {
    const counts = new Map();
    sorted.forEach((r) => counts.set(r.name, (counts.get(r.name) || 0) + 1));
    return [...counts.entries()];
  }, [sorted]);

  const activeName = examNames.some(([name]) => name === selectedName)
    ? selectedName
    : examNames[0]?.[0];

  // Grafik için: seçili sınavın kayıtları eskiden yeniye
  const trendRecords = useMemo(
    () => sorted.filter((r) => r.name === activeName).reverse(),
    [sorted, activeName]
  );

  const handleDelete = (id) => {
    if (window.confirm("Bu sınav kaydı silinsin mi?")) {
      setHistory(removeRecord(id));
    }
  };

  const handleClearAll = () => {
    if (
      window.confirm("Tüm sınav geçmişi silinsin mi? Bu işlem geri alınamaz.")
    ) {
      clearHistory();
      setHistory([]);
    }
  };

  if (history.length === 0) {
    return (
      <div className="history-page">
        <div className="container hs-container">
          <div className="hs-empty hs-card">
            <span className="hs-empty-icon">
              <FontAwesomeIcon icon={faClipboardList} />
            </span>
            <h1>Henüz kayıtlı bir sınav yok</h1>
            <p>
              Bir sınavı bitirip cevap anahtarını kaydettiğinde sonucun buraya
              eklenir ve gelişimini buradan takip edebilirsin.
            </p>
            <button
              type="button"
              className="hs-btn hs-btn--primary"
              onClick={() => navigate("/")}
            >
              Optiğe Git
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="container hs-container">
        <header className="hs-header">
          <div>
            <p className="hs-eyebrow">Sınav Geçmişi</p>
            <h1 className="hs-title">Sonuçların</h1>
            <p className="hs-meta">{history.length} kayıtlı sınav</p>
          </div>
          <button
            type="button"
            className="hs-btn hs-btn--ghost"
            onClick={handleClearAll}
          >
            <FontAwesomeIcon icon={faTrash} /> Tümünü Sil
          </button>
        </header>

        <section className="hs-card hs-trend">
          <div className="hs-trend-head">
            <h2>
              <FontAwesomeIcon icon={faChartLine} /> Net Gelişimi
            </h2>
            <div
              className="hs-chips"
              role="tablist"
              aria-label="Sınav seçimi"
            >
              {examNames.map(([name, count]) => (
                <button
                  key={name}
                  type="button"
                  className={`hs-chip ${
                    name === activeName ? "hs-chip--active" : ""
                  }`}
                  onClick={() => setSelectedName(name)}
                  aria-pressed={name === activeName}
                >
                  {name}
                  <span className="hs-chip-count">{count}</span>
                </button>
              ))}
            </div>
          </div>
          {trendRecords.length >= 2 ? (
            <NetTrendChart records={trendRecords} />
          ) : (
            <p className="hs-trend-hint">
              {activeName} sınavının net gelişimini görmek için bu sınavdan en
              az iki sonuç kaydetmelisin.
            </p>
          )}
        </section>

        <section className="hs-list">
          {sorted.map((record) => {
            const blank = record.empty + (record.unkeyed || 0);
            return (
              <article key={record.id} className="hs-card hs-record">
                <div className="hs-record-main">
                  <div className="hs-record-heading">
                    <h3>{record.name}</h3>
                    <span className="hs-record-date">
                      {fmtDateTime(record.date)}
                      {record.timeUsedSeconds > 0 && (
                        <>
                          {" · "}
                          <FontAwesomeIcon icon={faClock} />{" "}
                          {Math.round(record.timeUsedSeconds / 60)} dk
                        </>
                      )}
                    </span>
                  </div>
                  {record.subjects?.length > 1 && (
                    <p className="hs-record-subjects">
                      {record.subjects
                        .map(
                          (subject) =>
                            `${subject.name}: ${fmtNet(subject.net)} net`
                        )
                        .join(" · ")}
                    </p>
                  )}
                </div>
                <div className="hs-record-stats">
                  <span className="hs-stat hs-stat--good">
                    {record.right} D
                  </span>
                  <span className="hs-stat hs-stat--bad">
                    {record.wrong} Y
                  </span>
                  <span className="hs-stat hs-stat--neutral">{blank} B</span>
                  <span className="hs-net-badge">
                    Net {fmtNet(record.net)}
                  </span>
                  <span className="hs-score">%{record.score}</span>
                  <button
                    type="button"
                    className="hs-delete"
                    onClick={() => handleDelete(record.id)}
                    title="Kaydı sil"
                    aria-label={`${record.name} kaydını sil`}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default HistoryPage;
