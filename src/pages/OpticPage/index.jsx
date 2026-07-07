import { useState } from "react";
import Timer from "../../components/Timer";
import Statistics from "../../components/Statistics";
import "../../App.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRedo,
  faCheck,
  faEye,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { loadTimerData } from "../../utils/storage";
import { clearSessionId } from "../../utils/history";
import { formatTime } from "../../utils/formatter";

const OpticPage = () => {
  const navigate = useNavigate();
  const optic = useSelector((state) => state.optic);
  const options = ["A", "B", "C", "D", "E"];

  // State for statistics panel toggle
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // LocalStorage'dan seçilen şıkları al
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem("selectedAnswers");
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  // Zamanlayıcıyı sıfırlamak için bir state
  const [resetTimer, setResetTimer] = useState(false);

  // Süre bittiyse form kilitlenir (yenilemeden sonra da geçerli)
  const [timeUp, setTimeUp] = useState(
    () => loadTimerData()?.secondsLeft === 0
  );

  // Sınavı bitirme onay penceresi: null ya da { totalEmpty, bySubject, firstEmptyKey, secondsLeft }
  const [finishDialog, setFinishDialog] = useState(null);

  // Boş soruya gidince kısa süreli vurgulanacak sorunun anahtarı
  const [highlightKey, setHighlightKey] = useState(null);

  // Şık seçildiğinde çalışacak fonksiyon
  const handleClick = (questionIndex, option) => {
    const updatedAnswers = { ...selectedAnswers };
    if (updatedAnswers[questionIndex] === option) {
      delete updatedAnswers[questionIndex]; // Remove if already selected
    } else {
      updatedAnswers[questionIndex] = option; // Add if not selected
    }
    setSelectedAnswers(updatedAnswers);
    localStorage.setItem("selectedAnswers", JSON.stringify(updatedAnswers));
  };

  const clearAnswers = () => {
    setSelectedAnswers({});
    localStorage.removeItem("selectedAnswers");
    clearSessionId(); // yeni sınav = geçmişte yeni kayıt
    setTimeUp(false);
    setResetTimer(true);
    setTimeout(() => {
      setResetTimer(false);
    }, 1000); // 1 saniye sonra resetTimer'ı false yap
  };

  // Süre dolduğunda formu kilitle ve incelemeye geç
  const handleExpire = () => {
    setTimeUp(true);
    navigate("/review");
  };

  // Tüm optiği tarar: ders ders boş soru sayıları ve ilk boş soru
  const finishExam = () => {
    const sections =
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

    let firstEmptyKey = null;
    const bySubject = sections
      .map((section) => {
        const emptyKeys = section.keys.filter((k) => !selectedAnswers[k]);
        if (!firstEmptyKey && emptyKeys.length > 0) firstEmptyKey = emptyKeys[0];
        return { name: section.name, count: emptyKeys.length };
      })
      .filter((s) => s.count > 0);

    setFinishDialog({
      totalEmpty: bySubject.reduce((acc, s) => acc + s.count, 0),
      bySubject,
      firstEmptyKey,
      secondsLeft: loadTimerData()?.secondsLeft ?? null,
    });
  };

  const confirmFinish = () => {
    setFinishDialog(null);
    navigate("/review");
  };

  const goToFirstEmpty = () => {
    const key = finishDialog?.firstEmptyKey;
    setFinishDialog(null);
    if (!key) return;
    document
      .getElementById(`question-${key}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightKey(key);
    setTimeout(() => setHighlightKey(null), 2500);
  };

  const goToReview = () => {
    navigate("/review");
  };
  // Toggle statistics panel
  const toggleStats = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsStatsOpen(!isStatsOpen);
  };

  return (
    <div className="optic-page">
      <div className="container optic-page-container">
        <div className="optic-header">
          <h1 className="title">{optic.name}</h1>
          <div className="header-actions">
            <button
              className="btn"
              onClick={goToReview}
              title="Cevapları İncele"
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
            <button
              className="btn"
              onClick={clearAnswers}
              title="Tüm cevapları temizle"
            >
              <FontAwesomeIcon icon={faRedo} />
            </button>
            <button
              className="btn finish-btn"
              onClick={finishExam}
              title="Sınavı Bitir"
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
        </div>
        <div className="optic-group">
          <div className="subtitles-container">
            <div className="subtitles-header">
              <div className="subtitles sticky-subtitles">
                <p className="subtitle">
                  <span className="passive">Sınav süresi:</span>{" "}
                  {optic.examTime / 60 / 1000} dakika
                </p>
                <p className="subtitle">
                  <span className="passive">Soru sayısı:</span>{" "}
                  {optic.questionCount
                    ? optic.questionCount
                    : optic.subjects.reduce(
                        (acc, subject) => acc + subject.questionCount,
                        0
                      )}
                </p>
                <div className="subtitle">
                  {/* süreyi başlat */}
                  <Timer
                    time={optic.examTime}
                    resetTimer={resetTimer}
                    onExpire={handleExpire}
                  />
                  {/* clearAnswers fonksiyonunu çağır */}
                </div>
                <button 
                  className="toggle-btn" 
                  onClick={toggleStats}
                  title={isStatsOpen ? "İstatistikleri gizle" : "İstatistikleri göster"}
                >
                  <FontAwesomeIcon
                    icon={isStatsOpen ? faChevronUp : faChevronDown}
                    className="subtitles-toggle-icon"
                  />
                </button>
              </div>
            </div>
            {isStatsOpen && (
              <div className="stats-container">
                <Statistics selectedAnswers={selectedAnswers} optic={optic} />
              </div>
            )}
          </div>

          {/* for loop */}
          <div className="optic-subjects">
            {optic.examType === "singleSubject" ? (
              <ul className="list">
                {[...Array(optic.questionCount)].map((item, index) => (
                  <li
                    key={index}
                    id={`question-${index}`}
                    className={`list-item ${
                      highlightKey === `${index}` ? "list-item--highlight" : ""
                    }`}
                  >
                    <p className="question-no">{index + 1}</p>
                    <ul className="options">
                      {options.map((option, optionIndex) => (
                        <li key={optionIndex} className="option">
                          <button
                            className={
                              selectedAnswers[index] === option ? "active" : ""
                            }
                            disabled={timeUp}
                            onClick={() => handleClick(index, option)}
                          >
                            {option}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              optic.subjects.map((subject, subjectIndex) => (
                <div key={subjectIndex} className="optic-subject">
                  <h2 className="optic-subject-title">{subject.name}</h2>
                  <ul className="list">
                    {[...Array(subject.questionCount)].map(
                      (item, questionIndex) => (
                        <li
                          key={questionIndex}
                          id={`question-${subjectIndex}-${questionIndex}`}
                          className={`list-item ${
                            highlightKey === `${subjectIndex}-${questionIndex}`
                              ? "list-item--highlight"
                              : ""
                          }`}
                        >
                          <p className="question-no">{questionIndex + 1}</p>
                          <ul className="options">
                            {options.map((option, optionIndex) => (
                              <li key={optionIndex} className="option">
                                <button
                                  className={
                                    selectedAnswers[
                                      `${subjectIndex}-${questionIndex}`
                                    ] === option
                                      ? "active"
                                      : ""
                                  }
                                  disabled={timeUp}
                                  onClick={() =>
                                    handleClick(
                                      `${subjectIndex}-${questionIndex}`,
                                      option
                                    )
                                  }
                                >
                                  {option}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {finishDialog && (
        <div
          className="finish-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="finish-dialog-title"
          onClick={() => setFinishDialog(null)}
        >
          <div className="finish-dialog" onClick={(e) => e.stopPropagation()}>
            <h2 id="finish-dialog-title">Sınavı Bitir</h2>
            {finishDialog.totalEmpty > 0 ? (
              <>
                <p className="finish-warning">
                  <strong>{finishDialog.totalEmpty} soru boş.</strong>
                  {typeof finishDialog.secondsLeft === "number" &&
                    finishDialog.secondsLeft > 0 && (
                      <> Kalan süren: {formatTime(finishDialog.secondsLeft)}.</>
                    )}
                </p>
                <ul className="finish-empty-list">
                  {finishDialog.bySubject.map((subject) => (
                    <li key={subject.name}>
                      <span>{subject.name}</span>
                      <span className="finish-empty-count">
                        {subject.count} boş
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="finish-warning">
                Tüm sorular cevaplandı. İnceleme sayfasında cevap anahtarını
                girerek sonuçlarını görebilirsin.
              </p>
            )}
            <div className="finish-dialog-actions">
              <button className="btn finish-btn" onClick={confirmFinish}>
                {finishDialog.totalEmpty > 0 ? "Yine de Bitir" : "Sınavı Bitir"}
              </button>
              {finishDialog.totalEmpty > 0 && (
                <button className="btn" onClick={goToFirstEmpty}>
                  Boş Sorulara Git
                </button>
              )}
              <button
                className="btn btn--ghost"
                onClick={() => setFinishDialog(null)}
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpticPage;
