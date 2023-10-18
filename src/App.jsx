import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const questionLength = 80;
  const time = {
    hours: 3,
    minutes: 0,
    seconds: 0,
  };
  const [remainingTime, setRemainingTime] = useState(time);
  const [isTimeStarted, setIsTimeStarted] = useState(false);
  const options = ["A", "B", "C", "D", "E"];

  useEffect(() => {
    if (isTimeStarted) {
      const interval = setInterval(() => {
        if (remainingTime.seconds > 0) {
          setRemainingTime({
            ...remainingTime,
            seconds: remainingTime.seconds - 1,
          });
          document.title = `${formatTime(remainingTime.hours)}:${formatTime(
            remainingTime.minutes
          )}:${formatTime(remainingTime.seconds)}`;
        } else if (remainingTime.minutes > 0) {
          setRemainingTime({
            ...remainingTime,
            minutes: remainingTime.minutes - 1,
            seconds: 59,
          });
        } else if (remainingTime.hours > 0) {
          setRemainingTime({
            ...remainingTime,
            hours: remainingTime.hours - 1,
            minutes: 59,
            seconds: 59,
          });
        } else {
          setIsTimeStarted(false);
          setRemainingTime(time);
          alert("Süre doldu!");
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isTimeStarted, remainingTime]);

  const handleClick = (e) => {
    const button = e.target;

    // remove active class from the other buttons in the same question
    const buttons = button
      .closest(".list-item")
      .querySelectorAll(".option button");
    buttons.forEach((item) => {
      if (item !== button) {
        item.classList.remove("active");
      }
    });

    button.classList.toggle("active");
  };

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  useEffect(() => {
    document.title = `Sanal Optik - ${formatTime(
      remainingTime.hours
    )}:${formatTime(remainingTime.minutes)}:${formatTime(
      remainingTime.seconds
    )}`;
  }, [remainingTime]);

  return (
    <>
      <div className="container">
        <h1 className="title">Sanal Optik Form</h1>
        <div className="subtitles">
          <p className="subtitle">
            Sınav süresi: {formatTime(time.hours)}:{formatTime(time.minutes)}:
            {formatTime(time.seconds)}
          </p>
          <p className="subtitle">Soru sayısı: {questionLength}</p>
          <div className="remaining-time">
            {/* süreyi başlat */}
            <p className="subtitle">
              Kalan süre: {formatTime(remainingTime.hours)}:
              {formatTime(remainingTime.minutes)}:
              {formatTime(remainingTime.seconds)}
            </p>
            {!isTimeStarted ? (
              <button
                className="start-button btn"
                onClick={() => setIsTimeStarted(true)}
              >
                Başlat
              </button>
            ) : (
              <button
                className="stop-button btn"
                onClick={() => setIsTimeStarted(false)}
              >
                Durdur
              </button>
            )}
          </div>
        </div>
        {/* for loop */}
        <ul className="list">
          {Array.from(Array(questionLength).keys()).map((item, index) => (
            <li key={index} className="list-item">
              <p className="question-no">{index + 1}</p>
              <ul className="options">
                {options.map((item, index) => (
                  <li key={index} className="option">
                    <button onClick={handleClick}>{item}</button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
