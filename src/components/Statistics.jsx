import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faQuestionCircle,
  faTimesCircle,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import "./Statistics.css";

const Statistics = ({ selectedAnswers, optic }) => {
  const [isSubjectStatsOpen, setIsSubjectStatsOpen] = useState(false);

  const toggleSubjectStats = () => {
    setIsSubjectStatsOpen(!isSubjectStatsOpen);
  };

  const calculateStats = () => {
    const totalQuestions =
      optic.examType === "singleSubject"
        ? optic.questionCount
        : optic.subjects.reduce(
            (acc, subject) => acc + subject.questionCount,
            0
          );

    const answeredCount = Object.keys(selectedAnswers).length;
    const unansweredCount = totalQuestions - answeredCount;

    let subjectStats = [];

    if (optic.examType === "multiSubject") {
      subjectStats = optic.subjects.map((subject, subjectIndex) => {
        const subjectAnswers = Object.keys(selectedAnswers).filter((key) =>
          key.startsWith(`${subjectIndex}-`)
        ).length;

        return {
          name: subject.name,
          total: subject.questionCount,
          answered: subjectAnswers,
          percentage: Math.round(
            (subjectAnswers / subject.questionCount) * 100
          ),
        };
      });
    }

    return {
      totalQuestions,
      answeredCount,
      unansweredCount,
      completionPercentage: Math.round((answeredCount / totalQuestions) * 100),
      subjectStats,
    };
  };

  const stats = calculateStats();

  return (
    <div className="statistics-panel">
      <h3 className="stats-title">İstatistikler</h3>

      <div className="overall-stats">
        <div className="stat-item answered">
          <FontAwesomeIcon icon={faCheckCircle} className="stat-icon" />
          <div className="stat-content">
            <span className="stat-number">{stats.answeredCount}</span>
            <span className="stat-label">Cevaplanan</span>
          </div>
        </div>

        <div className="stat-item unanswered">
          <FontAwesomeIcon icon={faQuestionCircle} className="stat-icon" />
          <div className="stat-content">
            <span className="stat-number">{stats.unansweredCount}</span>
            <span className="stat-label">Boş</span>
          </div>
        </div>

        <div className="stat-item completion">
          <FontAwesomeIcon icon={faTimesCircle} className="stat-icon" />
          <div className="stat-content">
            <span className="stat-number">{stats.completionPercentage}%</span>
            <span className="stat-label">Tamamlanan</span>
          </div>
        </div>
      </div>      {stats.subjectStats.length > 0 && (
        <div className="subject-stats">
          <div 
            className="subject-stats-header" 
            onClick={toggleSubjectStats}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSubjectStats();
              }
            }}
          >
            <h4 className="subject-stats-title">Ders Bazında</h4>
            <FontAwesomeIcon 
              icon={isSubjectStatsOpen ? faChevronUp : faChevronDown} 
              className="subject-stats-toggle"
            />
          </div>
          <div className={`subject-stats-content ${isSubjectStatsOpen ? 'subject-stats-content--open' : ''}`}>
            {stats.subjectStats.map((subject, index) => (
              <div key={index} className="subject-stat">
                <div className="subject-name">{subject.name}</div>
                <div className="subject-progress">
                  <span className="subject-numbers">
                    {subject.answered}/{subject.total}
                  </span>
                  <div className="subject-bar">
                    <div
                      className="subject-fill"
                      style={{ width: `${subject.percentage}%` }}
                    />
                  </div>
                  <span className="subject-percentage">
                    {subject.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
