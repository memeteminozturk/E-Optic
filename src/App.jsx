import { useState, useEffect } from "react";
import "./App.css";
import Timer from "./components/Timer";

function App() {
  const questionLength = 80;
  const options = ["A", "B", "C", "D", "E"];

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

  return (
    <>
      <div className="container">
        <h1 className="title">Sanal Optik Form</h1>
        <div className="subtitles">
          <p className="subtitle">
            <span className="passive">Sınav süresi:</span> 3:00:00
          </p>
          <p className="subtitle">
            <span className="passive">Soru sayısı:</span> {questionLength}
          </p>
          <div className="subtitle">
            {/* süreyi başlat */}
            <Timer time={3 * 60 * 60 * 1000} /> {/*  3 saat */}
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
