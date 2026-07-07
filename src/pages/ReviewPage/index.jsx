import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faDownload,
  faShareNodes,
  faPrint,
  faKey,
  faEraser,
  faCheck,
  faCheckCircle,
  faTimesCircle,
  faMinusCircle,
  faQuestionCircle,
  faBullseye,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";
import ScoreRing from "./ScoreRing";
import "./style.css";

const OPTIONS = ["A", "B", "C", "D", "E"];

const STATUS_META = {
  correct: { icon: faCheckCircle, label: "Doğru" },
  wrong: { icon: faTimesCircle, label: "Yanlış" },
  empty: { icon: faMinusCircle, label: "Boş" },
  unkeyed: { icon: faQuestionCircle, label: "Anahtarsız" },
};

const readStored = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
};

// Sınav yapısını tek biçime indirger: her bölüm bir isim + soru anahtarları listesi
const buildSections = (optic) =>
  optic.examType === "singleSubject"
    ? [
        {
          name: "Sorular",
          keys: [...Array(optic.questionCount || 0)].map((_, i) => `${i}`),
        },
      ]
    : (optic.subjects || []).map((subject, subjectIndex) => ({
        name: subject.name,
        keys: [...Array(subject.questionCount)].map(
          (_, qi) => `${subjectIndex}-${qi}`
        ),
      }));

const gradeInfo = (score) => {
  if (score >= 85)
    return { label: "Mükemmel", note: "Harika iş çıkardın, bu seviyeyi koru." };
  if (score >= 70)
    return { label: "İyi", note: "Az kaldı, yanlışlarına göz atmayı unutma." };
  if (score >= 50)
    return { label: "Orta", note: "Doğru yoldasın, eksik konularına odaklan." };
  return {
    label: "Geliştirilmeli",
    note: "Yanlışlarını incele, tekrar denediğinde fark göreceksin.",
  };
};

const fmtNet = (n) =>
  n.toLocaleString("tr-TR", { maximumFractionDigits: 2 });

const BulkFill = ({ section, onApply }) => {
  const [text, setText] = useState("");

  const submit = () => {
    const cleaned = text.toUpperCase().replace(/[^A-E-]/g, "");
    if (!cleaned) {
      toast.error("Geçerli bir dizi girin. Örn: ABCDE (boş için -)");
      return;
    }
    onApply(section, cleaned);
    setText("");
  };

  return (
    <div className="rv-bulk">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Hızlı giriş: ABCDE… (boş için -)"
        aria-label={`${section.name} için toplu cevap anahtarı girişi`}
      />
      <button
        type="button"
        className="rv-btn rv-btn--ghost rv-bulk-apply"
        onClick={submit}
        disabled={!text.trim()}
      >
        Uygula
      </button>
    </div>
  );
};

const ReviewPage = () => {
  const navigate = useNavigate();
  const optic = useSelector((state) => state.optic);

  const [answers] = useState(() => readStored("selectedAnswers"));
  const [answerKey, setAnswerKey] = useState(() => readStored("correctAnswers"));
  const [draftKey, setDraftKey] = useState(() => readStored("correctAnswers"));
  const [mode, setMode] = useState(() =>
    Object.keys(readStored("correctAnswers")).length > 0 ? "results" : "key"
  );
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    document.title = "Sanal Optik - İnceleme";
  }, []);

  const sections = useMemo(() => buildSections(optic), [optic]);
  const allKeys = useMemo(
    () => sections.flatMap((section) => section.keys),
    [sections]
  );

  const hasAnswers = Object.keys(answers).length > 0;
  const hasKey = allKeys.some((k) => answerKey[k]);

  const statusOf = (k) => {
    const given = answers[k];
    const correct = answerKey[k];
    if (!given) return "empty";
    if (!correct) return "unkeyed";
    return given === correct ? "correct" : "wrong";
  };

  const results = useMemo(() => {
    const subjects = sections.map((section) => {
      let right = 0;
      let wrong = 0;
      let empty = 0;
      let unkeyed = 0;
      section.keys.forEach((k) => {
        const given = answers[k];
        const correct = answerKey[k];
        if (!given) empty++;
        else if (!correct) unkeyed++;
        else if (given === correct) right++;
        else wrong++;
      });
      return {
        name: section.name,
        total: section.keys.length,
        right,
        wrong,
        empty,
        unkeyed,
        net: right - wrong / 4,
      };
    });

    const sum = (pick) => subjects.reduce((acc, s) => acc + pick(s), 0);
    const total = sum((s) => s.total);
    const right = sum((s) => s.right);

    return {
      subjects,
      total,
      right,
      wrong: sum((s) => s.wrong),
      empty: sum((s) => s.empty),
      unkeyed: sum((s) => s.unkeyed),
      net: sum((s) => s.net),
      score: total > 0 ? Math.round((right / total) * 100) : 0,
    };
  }, [sections, answers, answerKey]);

  const grade = gradeInfo(results.score);
  const draftCount = allKeys.filter((k) => draftKey[k]).length;

  const filterCounts = useMemo(() => {
    const counts = { all: allKeys.length, correct: 0, wrong: 0, empty: 0 };
    allKeys.forEach((k) => {
      const st = statusOf(k);
      if (counts[st] !== undefined) counts[st]++;
    });
    return counts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allKeys, answers, answerKey]);

  const toggleDraft = (k, option) => {
    setDraftKey((prev) => {
      const next = { ...prev };
      if (next[k] === option) delete next[k];
      else next[k] = option;
      return next;
    });
  };

  const applyBulk = (section, cleaned) => {
    setDraftKey((prev) => {
      const next = { ...prev };
      section.keys.forEach((k, i) => {
        const ch = cleaned[i];
        if (!ch) return;
        if (ch === "-") delete next[k];
        else next[k] = ch;
      });
      return next;
    });
  };

  const saveKey = () => {
    const pruned = {};
    allKeys.forEach((k) => {
      if (draftKey[k]) pruned[k] = draftKey[k];
    });
    if (Object.keys(pruned).length === 0) {
      toast.error("En az bir sorunun doğru cevabını girmelisiniz.");
      return;
    }
    localStorage.setItem("correctAnswers", JSON.stringify(pruned));
    setAnswerKey(pruned);
    setDraftKey(pruned);
    setMode("results");
    toast.success("Cevap anahtarı kaydedildi.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openKeyEditor = () => {
    setDraftKey(answerKey);
    setMode("key");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const exportResults = () => {
    const data = {
      examName: optic.name,
      examDate: new Date().toLocaleDateString("tr-TR"),
      results: {
        score: results.score,
        net: results.net,
        right: results.right,
        wrong: results.wrong,
        empty: results.empty,
        total: results.total,
        subjects: results.subjects,
      },
      answers,
      correctAnswers: answerKey,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${optic.name.replace(/\s+/g, "_")}_sonuclari.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    const text = `${optic.name} sınavı: %${results.score} başarı · ${
      results.right
    } doğru, ${results.wrong} yanlış, ${results.empty} boş · Net: ${fmtNet(
      results.net
    )}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${optic.name} Sınav Sonucu`, text });
        return;
      } catch {
        /* kullanıcı vazgeçti; panoya kopyalamayı dene */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Sonuç panoya kopyalandı.");
    } catch {
      toast.error("Paylaşım desteklenmiyor.");
    }
  };

  // Hiç veri yoksa: boş durum
  if (!hasAnswers && !hasKey) {
    return (
      <div className="review-page">
        <div className="container rv-container">
          <div className="rv-empty rv-card">
            <span className="rv-empty-icon">
              <FontAwesomeIcon icon={faClipboardList} />
            </span>
            <h1>Henüz incelenecek bir sınav yok</h1>
            <p>
              Optik formu doldurup sınavı bitirdiğinde sonuçların burada seni
              bekliyor olacak.
            </p>
            <button
              type="button"
              className="rv-btn rv-btn--primary"
              onClick={() => navigate("/")}
            >
              Optiğe Git
            </button>
          </div>
        </div>
      </div>
    );
  }

  const neutralCount = results.total - results.right - results.wrong;

  return (
    <div className="review-page">
      <div className="container rv-container">
        <header className="rv-header">
          <div className="rv-heading">
            <p className="rv-eyebrow">Sınav İncelemesi</p>
            <h1 className="rv-title">{optic.name}</h1>
            <p className="rv-meta">
              {new Date().toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              {" · "}
              {results.total} soru
            </p>
          </div>
          <div className="rv-actions">
            <button
              type="button"
              className="rv-icon-btn"
              onClick={() => navigate("/")}
              title="Ana Sayfa"
              aria-label="Ana sayfaya dön"
            >
              <FontAwesomeIcon icon={faHome} />
            </button>
            {mode === "results" && (
              <>
                <button
                  type="button"
                  className="rv-icon-btn"
                  onClick={openKeyEditor}
                  title="Cevap Anahtarını Düzenle"
                  aria-label="Cevap anahtarını düzenle"
                >
                  <FontAwesomeIcon icon={faKey} />
                </button>
                <button
                  type="button"
                  className="rv-icon-btn"
                  onClick={exportResults}
                  title="Sonuçları İndir"
                  aria-label="Sonuçları indir"
                >
                  <FontAwesomeIcon icon={faDownload} />
                </button>
                <button
                  type="button"
                  className="rv-icon-btn"
                  onClick={shareResults}
                  title="Sonuçları Paylaş"
                  aria-label="Sonuçları paylaş"
                >
                  <FontAwesomeIcon icon={faShareNodes} />
                </button>
                <button
                  type="button"
                  className="rv-icon-btn"
                  onClick={() => window.print()}
                  title="Yazdır"
                  aria-label="Sonuçları yazdır"
                >
                  <FontAwesomeIcon icon={faPrint} />
                </button>
              </>
            )}
          </div>
        </header>

        {mode === "key" ? (
          <div className="rv-key-mode">
            <section className="rv-card rv-card--accent rv-key-summary">
              <div className="rv-key-summary-text">
                <h2>Cevap Anahtarı</h2>
                <p>
                  Sonuçlarını görebilmek için sınavın doğru cevaplarını gir.
                  Her ders için tek tek işaretleyebilir veya hızlı giriş
                  alanına <strong>ABCDE…</strong> biçiminde yazabilirsin.
                </p>
              </div>
              <div className="rv-key-progress">
                <div className="rv-key-progress-info">
                  <span>{draftCount}/{allKeys.length} soru girildi</span>
                  <span>
                    {allKeys.length > 0
                      ? Math.round((draftCount / allKeys.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
                <div
                  className="rv-meter"
                  role="progressbar"
                  aria-valuenow={draftCount}
                  aria-valuemin={0}
                  aria-valuemax={allKeys.length}
                >
                  <div
                    className="rv-meter-fill"
                    style={{
                      width: `${
                        allKeys.length > 0
                          ? (draftCount / allKeys.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </section>

            {sections.map((section) => {
              const sectionCount = section.keys.filter(
                (k) => draftKey[k]
              ).length;
              return (
                <section key={section.name} className="rv-card rv-key-section">
                  <div className="rv-key-section-header">
                    <h3>{section.name}</h3>
                    <span className="rv-key-count">
                      {sectionCount}/{section.keys.length}
                    </span>
                  </div>
                  <BulkFill section={section} onApply={applyBulk} />
                  <div className="rv-key-grid">
                    {section.keys.map((k, qi) => (
                      <div key={k} className="rv-key-cell">
                        <span className="rv-key-no">{qi + 1}</span>
                        <div className="rv-key-opts">
                          {OPTIONS.map((option) => (
                            <button
                              key={option}
                              type="button"
                              className={draftKey[k] === option ? "active" : ""}
                              onClick={() => toggleDraft(k, option)}
                              aria-pressed={draftKey[k] === option}
                              aria-label={`Soru ${qi + 1} doğru cevap ${option}`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}

            <div className="rv-key-footer">
              <button
                type="button"
                className="rv-btn rv-btn--primary"
                onClick={saveKey}
              >
                <FontAwesomeIcon icon={faCheck} /> Kaydet ve Değerlendir
              </button>
              <button
                type="button"
                className="rv-btn rv-btn--ghost"
                onClick={() => setDraftKey({})}
              >
                <FontAwesomeIcon icon={faEraser} /> Temizle
              </button>
              {hasKey && (
                <button
                  type="button"
                  className="rv-btn rv-btn--ghost"
                  onClick={() => {
                    setDraftKey(answerKey);
                    setMode("results");
                  }}
                >
                  Vazgeç
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rv-results">
            <section className="rv-card rv-card--accent rv-hero">
              <ScoreRing
                label={`Başarı yüzdesi ${results.score}: ${results.right} doğru, ${results.wrong} yanlış, ${neutralCount} boş`}
                segments={[
                  { tone: "good", value: results.right, label: "Doğru" },
                  { tone: "bad", value: results.wrong, label: "Yanlış" },
                  {
                    tone: "neutral",
                    value: neutralCount,
                    label:
                      results.unkeyed > 0 ? "Boş / Anahtarsız" : "Boş",
                  },
                ]}
              >
                <span className="rv-score-value">%{results.score}</span>
                <span className="rv-score-cap">başarı</span>
              </ScoreRing>

              <div className="rv-hero-body">
                <h2 className="rv-grade">{grade.label}</h2>
                <p className="rv-grade-note">{grade.note}</p>
                <div className="rv-tiles">
                  <div className="rv-tile">
                    <span className="rv-tile-icon rv-tile-icon--good">
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </span>
                    <div className="rv-tile-body">
                      <span className="rv-tile-value">{results.right}</span>
                      <span className="rv-tile-label">Doğru</span>
                    </div>
                  </div>
                  <div className="rv-tile">
                    <span className="rv-tile-icon rv-tile-icon--bad">
                      <FontAwesomeIcon icon={faTimesCircle} />
                    </span>
                    <div className="rv-tile-body">
                      <span className="rv-tile-value">{results.wrong}</span>
                      <span className="rv-tile-label">Yanlış</span>
                    </div>
                  </div>
                  <div className="rv-tile">
                    <span className="rv-tile-icon rv-tile-icon--neutral">
                      <FontAwesomeIcon icon={faMinusCircle} />
                    </span>
                    <div className="rv-tile-body">
                      <span className="rv-tile-value">{results.empty}</span>
                      <span className="rv-tile-label">Boş</span>
                    </div>
                  </div>
                  <div className="rv-tile">
                    <span className="rv-tile-icon rv-tile-icon--accent">
                      <FontAwesomeIcon icon={faBullseye} />
                    </span>
                    <div className="rv-tile-body">
                      <span className="rv-tile-value">
                        {fmtNet(results.net)}
                      </span>
                      <span className="rv-tile-label">Net</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {results.unkeyed > 0 && (
              <div className="rv-notice">
                <FontAwesomeIcon icon={faQuestionCircle} />
                <span>
                  {results.unkeyed} soru için cevap anahtarı girilmedi; bu
                  sorular puanlamaya katılmadı.
                </span>
                <button
                  type="button"
                  className="rv-btn rv-btn--ghost"
                  onClick={openKeyEditor}
                >
                  Anahtarı Tamamla
                </button>
              </div>
            )}

            {results.subjects.length > 1 && (
              <section className="rv-subjects">
                {results.subjects.map((subject) => (
                  <div key={subject.name} className="rv-card rv-subject-card">
                    <div className="rv-subject-head">
                      <h3>{subject.name}</h3>
                      <span className="rv-net-badge">
                        Net {fmtNet(subject.net)}
                      </span>
                    </div>
                    <div
                      className="rv-bar"
                      role="img"
                      aria-label={`${subject.name}: ${subject.right} doğru, ${subject.wrong} yanlış, ${
                        subject.empty + subject.unkeyed
                      } boş`}
                    >
                      {subject.right > 0 && (
                        <span
                          className="rv-bar-seg rv-bar-seg--good"
                          style={{ flexGrow: subject.right }}
                        />
                      )}
                      {subject.wrong > 0 && (
                        <span
                          className="rv-bar-seg rv-bar-seg--bad"
                          style={{ flexGrow: subject.wrong }}
                        />
                      )}
                      {subject.empty + subject.unkeyed > 0 && (
                        <span
                          className="rv-bar-seg rv-bar-seg--neutral"
                          style={{ flexGrow: subject.empty + subject.unkeyed }}
                        />
                      )}
                    </div>
                    <div className="rv-counts">
                      <span>
                        <i className="rv-dot rv-dot--good" /> {subject.right} D
                      </span>
                      <span>
                        <i className="rv-dot rv-dot--bad" /> {subject.wrong} Y
                      </span>
                      <span>
                        <i className="rv-dot rv-dot--neutral" />{" "}
                        {subject.empty + subject.unkeyed} B
                      </span>
                    </div>
                  </div>
                ))}
              </section>
            )}

            <section className="rv-card rv-answers">
              <div className="rv-answers-head">
                <h2>Cevap Karşılaştırması</h2>
                <div className="rv-filters" role="tablist" aria-label="Cevap filtresi">
                  {[
                    { id: "all", label: "Tümü" },
                    { id: "correct", label: "Doğru" },
                    { id: "wrong", label: "Yanlış" },
                    { id: "empty", label: "Boş" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`rv-filter ${
                        filter === f.id ? "rv-filter--active" : ""
                      } rv-filter--${f.id}`}
                      onClick={() => setFilter(f.id)}
                      aria-pressed={filter === f.id}
                    >
                      {f.label}
                      <span className="rv-filter-count">
                        {filterCounts[f.id]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {sections.map((section) => {
                const items = section.keys
                  .map((k, qi) => ({ k, qi, status: statusOf(k) }))
                  .filter(
                    (item) => filter === "all" || item.status === filter
                  );
                if (items.length === 0) return null;
                return (
                  <div key={section.name} className="rv-answer-section">
                    {sections.length > 1 && <h3>{section.name}</h3>}
                    <div className="rv-chip-grid">
                      {items.map(({ k, qi, status }) => {
                        const meta = STATUS_META[status];
                        const given = answers[k];
                        const correct = answerKey[k];
                        return (
                          <div
                            key={k}
                            className={`rv-chip rv-chip--${status}`}
                            aria-label={`Soru ${qi + 1}: ${
                              given ? `cevabın ${given}` : "boş"
                            }${
                              correct ? `, doğru cevap ${correct}` : ""
                            } — ${meta.label}`}
                          >
                            <div className="rv-chip-top">
                              <span className="rv-chip-no">{qi + 1}</span>
                              <FontAwesomeIcon
                                icon={meta.icon}
                                className="rv-chip-icon"
                                title={meta.label}
                              />
                            </div>
                            <div className="rv-chip-answers">
                              <div className="rv-chip-answer">
                                <span className="rv-letter rv-letter--user">
                                  {given || "–"}
                                </span>
                                <span className="rv-letter-cap">Cevabın</span>
                              </div>
                              {status !== "correct" && correct && (
                                <div className="rv-chip-answer">
                                  <span className="rv-letter rv-letter--key">
                                    {correct}
                                  </span>
                                  <span className="rv-letter-cap">Doğru</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
