import React, { useEffect } from "react";
import "../App.css";
import { useCountdownTimer } from "../hooks/useCountdownTimer";
import { formatTime } from "../utils/formatter";

const Timer = ({ time, resetTimer }) => {
    const TITLE_BASE = "Sanal Optik";
    const { secondsLeft, isRunning, start, pause, reset } = useCountdownTimer(
        time,
        resetTimer
    );
    
  useEffect(() => {
    document.title = isRunning
      ? `${formatTime(secondsLeft)} - ${TITLE_BASE}`
      : TITLE_BASE;
  }, [secondsLeft, isRunning]);

  return (
    <div className="timer">
      <div className="remaining-time">
        <p className="passive">Süreniz:</p>
        <p className="time">{formatTime(secondsLeft)}</p>
      </div>
      <div className="buttons">
        {!isRunning ? (
          <button className="start-button btn" onClick={start}>
            Başlat
          </button>
        ) : (
          <button className="stop-button btn" onClick={pause}>
            Durdur
          </button>
        )}
        <button className="reset-button btn" onClick={reset}>
          Sıfırla
        </button>
      </div>
    </div>
  );
};

export default Timer;
