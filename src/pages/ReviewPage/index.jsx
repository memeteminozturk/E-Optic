import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faHome,
  faPrint,
  faShare,
} from "@fortawesome/free-solid-svg-icons";

const ReviewPage = () => {
  const navigate = useNavigate();
  const optic = useSelector((state) => state.optic);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [correctAnswers, setCorrectAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const savedAnswers = localStorage.getItem("selectedAnswers");
    const savedCorrectAnswers = localStorage.getItem("correctAnswers");

    if (savedAnswers) {
      setSelectedAnswers(JSON.parse(savedAnswers));
    }

    if (savedCorrectAnswers) {
      setCorrectAnswers(JSON.parse(savedCorrectAnswers));
      setShowResults(true);
    }

    document.title = "Sanal Optik - İnceleme";
  }, []);

  const calculateResults = () => {
    const totalQuestions =
      optic.examType === "singleSubject"
        ? optic.questionCount
        : optic.subjects.reduce(
            (acc, subject) => acc + subject.questionCount,
            0
          );

    let correctCount = 0;
    let wrongCount = 0;
    let emptyCount = 0;

    Object.keys(correctAnswers).forEach((key) => {
      if (selectedAnswers[key]) {
        if (selectedAnswers[key] === correctAnswers[key]) {
          correctCount++;
        } else {
          wrongCount++;
        }
      } else {
        emptyCount++;
      }
    });

    const score = (correctCount / totalQuestions) * 100;

    return {
      totalQuestions,
      correctCount,
      wrongCount,
      emptyCount,
      score: score.toFixed(2),
    };
  };

  const results = showResults ? calculateResults() : null;

  const exportResults = () => {
    const data = {
      examName: optic.name,
      examDate: new Date().toLocaleDateString("tr-TR"),
      results: results,
      answers: selectedAnswers,
      correctAnswers: correctAnswers,
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${optic.name}_sonuclari.json`;
    link.click();
  };

  const shareResults = async () => {
    if (navigator.share && results) {
      try {
        await navigator.share({
          title: `${optic.name} Sınav Sonucu`,
          text: `${optic.name} sınavından ${results.score}% puan aldım! 
                    Doğru: ${results.correctCount}, Yanlış: ${results.wrongCount}, Boş: ${results.emptyCount}`,
        });
      } catch (err) {
        console.log("Paylaşım başarısız:", err);
      }
    }
  };

  return (
    <div className="review-page">
      <div className="container review-container">
        <div className="review-header">
          <h1 className="title">Sınav İncelemesi</h1>
          <div className="review-actions">
            <button
              className="btn"
              onClick={() => navigate("/")}
              title="Ana Sayfaya Dön"
            >
              <FontAwesomeIcon icon={faHome} />
            </button>
            {showResults && (
              <>
                <button
                  className="btn"
                  onClick={exportResults}
                  title="Sonuçları İndir"
                >
                  <FontAwesomeIcon icon={faPrint} />
                </button>
                <button
                  className="btn"
                  onClick={shareResults}
                  title="Sonuçları Paylaş"
                >
                  <FontAwesomeIcon icon={faShare} />
                </button>
              </>
            )}
          </div>
        </div>

        {showResults && results && (
          <div className="results-summary">
            <h2>Sınav Sonuçları</h2>
            <div className="score-card">
              <div className="score-main">
                <span className="score-percentage">{results.score}%</span>
                <span className="score-grade">
                  {results.score >= 85
                    ? "Mükemmel"
                    : results.score >= 70
                    ? "İyi"
                    : results.score >= 50
                    ? "Orta"
                    : "Geliştirilmeli"}
                </span>
              </div>
              <div className="score-details">
                <div className="score-item correct">
                  <FontAwesomeIcon icon={faCheckCircle} />
                  <span>Doğru: {results.correctCount}</span>
                </div>
                <div className="score-item wrong">
                  <FontAwesomeIcon icon={faTimesCircle} />
                  <span>Yanlış: {results.wrongCount}</span>
                </div>
                <div className="score-item empty">
                  <span>Boş: {results.emptyCount}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="answers-review">
          <h2>Cevap Karşılaştırması</h2>
          {optic.examType === "singleSubject" ? (
            <div className="subject-review">
              <div className="answers-grid">
                {[...Array(optic.questionCount)].map((_, index) => (
                  <div
                    key={index}
                    className={`answer-item ${
                      showResults
                        ? selectedAnswers[index] === correctAnswers[index]
                          ? "correct"
                          : selectedAnswers[index] &&
                            selectedAnswers[index] !== correctAnswers[index]
                          ? "wrong"
                          : "empty"
                        : ""
                    }`}
                  >
                    <span className="question-number">{index + 1}</span>
                    <div className="answer-comparison">
                      <span className="user-answer">
                        Cevabınız: {selectedAnswers[index] || "Boş"}
                      </span>
                      {showResults && (
                        <span className="correct-answer">
                          Doğru: {correctAnswers[index] || "Belirsiz"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            optic.subjects.map((subject, subjectIndex) => (
              <div key={subjectIndex} className="subject-review">
                <h3>{subject.name}</h3>
                <div className="answers-grid">
                  {[...Array(subject.questionCount)].map((_, questionIndex) => {
                    const key = `${subjectIndex}-${questionIndex}`;
                    return (
                      <div
                        key={questionIndex}
                        className={`answer-item ${
                          showResults
                            ? selectedAnswers[key] === correctAnswers[key]
                              ? "correct"
                              : selectedAnswers[key] &&
                                selectedAnswers[key] !== correctAnswers[key]
                              ? "wrong"
                              : "empty"
                            : ""
                        }`}
                      >
                        <span className="question-number">
                          {questionIndex + 1}
                        </span>
                        <div className="answer-comparison">
                          <span className="user-answer">
                            Cevabınız: {selectedAnswers[key] || "Boş"}
                          </span>
                          {showResults && (
                            <span className="correct-answer">
                              Doğru: {correctAnswers[key] || "Belirsiz"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {!showResults && (
          <div className="no-results">
            <p>
              Henüz sonuç yüklenmemiş. Sınavı tamamladıktan sonra sonuçlarınızı
              buradan görebilirsiniz.
            </p>
            <button className="btn" onClick={() => navigate("/")}>
              Sınava Dön
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;
