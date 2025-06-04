import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ current, total, subject = null }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-text">
          {subject ? `${subject}: ` : ""}
          {current}/{total} tamamlandı
        </span>
        <span className="progress-percentage">{percentage}%</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin="0"
          aria-valuemax={total}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
