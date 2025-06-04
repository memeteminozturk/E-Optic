import React, { useEffect, useState } from "react";
import Timer from "../../components/Timer";
import Statistics from "../../components/Statistics";
import "../../App.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo, faCheck, faEye } from "@fortawesome/free-solid-svg-icons";

const OpticPage = () => {
  const navigate = useNavigate();
  const optic = useSelector((state) => state.optic);
  const options = ["A", "B", "C", "D", "E"];

  // LocalStorage'dan seçilen şıkları al
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const savedAnswers = localStorage.getItem("selectedAnswers");
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  // Zamanlayıcıyı sıfırlamak için bir state
  const [resetTimer, setResetTimer] = useState(false);

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
    setResetTimer(true);
    setTimeout(() => {
      setResetTimer(false);
    }, 1000); // 1 saniye sonra resetTimer'ı false yap
  };

  const finishExam = () => {
    const confirmation = window.confirm(
      "Sınavı bitirmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
    );
    if (confirmation) {
      // Generate sample correct answers for demonstration
      const sampleCorrectAnswers = {};
      if (optic.examType === "singleSubject") {
        for (let i = 0; i < optic.questionCount; i++) {
          sampleCorrectAnswers[i] = ["A", "B", "C", "D", "E"][
            Math.floor(Math.random() * 5)
          ];
        }
      } else {
        optic.subjects.forEach((subject, subjectIndex) => {
          for (let i = 0; i < subject.questionCount; i++) {
            sampleCorrectAnswers[`${subjectIndex}-${i}`] = [
              "A",
              "B",
              "C",
              "D",
              "E",
            ][Math.floor(Math.random() * 5)];
          }
        });
      }
      localStorage.setItem(
        "correctAnswers",
        JSON.stringify(sampleCorrectAnswers)
      );
      navigate("/review");
    }
  };

  const goToReview = () => {
    navigate("/review");
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
          <div className="subtitles">
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
              <Timer time={optic.examTime} resetTimer={resetTimer} />
              {/* clearAnswers fonksiyonunu çağır */}
            </div>
          </div>

          <Statistics selectedAnswers={selectedAnswers} optic={optic} />

          {/* for loop */}
          <div className="optic-subjects">
            {optic.examType === "singleSubject" ? (
              <ul className="list">
                {[...Array(optic.questionCount)].map((item, index) => (
                  <li key={index} className="list-item">
                    <p className="question-no">{index + 1}</p>
                    <ul className="options">
                      {options.map((option, optionIndex) => (
                        <li key={optionIndex} className="option">
                          <button
                            className={
                              selectedAnswers[index] === option ? "active" : ""
                            }
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
                        <li key={questionIndex} className="list-item">
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
    </div>
  );
};

export default OpticPage;
