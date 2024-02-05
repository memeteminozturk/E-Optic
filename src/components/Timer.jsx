import React, { useState, useEffect } from "react";
import "../App.css";
import { useTimer } from "react-timer-hook";

const Timer = ({ time }) => {
    // time is in milliseconds so we need to convert it to date object

    const getExpiryTimestamp = () => {
        var timer = new Date();
        var timerHours = time / 3600000;
        var timerMinutes = (time % 3600000) / 60000;
        var timerSeconds = (time % 60000) / 1000;
        timer.setHours(timer.getHours() + timerHours);
        timer.setMinutes(timer.getMinutes() + timerMinutes);
        timer.setSeconds(timer.getSeconds() + timerSeconds);
        return timer;
    }


    const {
        seconds,
        minutes,
        hours,
        isRunning,
        start,
        pause,
        restart
    } = useTimer({ expiryTimestamp: getExpiryTimestamp(), onExpire: () => console.warn('onExpire called'), autoStart: false });

    const formatTime = (hours, minutes, seconds) => {
        hours = hours.toString().padStart(2, "0");
        minutes = minutes.toString().padStart(2, "0");
        seconds = seconds.toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    }

    useEffect(() => {
        if (isRunning) {
            document.title = formatTime(hours, minutes, seconds) + " - Sanal Optik Form";
        } else {
            document.title = "Sanal Optik Form";
        }
    }, [isRunning, hours, minutes, seconds]);

    return (
        <div className="timer">
            <div className="remaining-time">
                <p className="passive">Süreniz:</p>
                <p className="time">{formatTime(hours, minutes, seconds)}</p>
            </div>
            <div className="buttons">
                {!isRunning ? (
                    <button
                        className="start-button btn"
                        onClick={start}
                    >
                        Başlat
                    </button>
                ) : (
                    <button
                        className="stop-button btn"
                        onClick={pause}
                    >
                        Durdur
                    </button>
                )}
                <button onClick={() => { restart(getExpiryTimestamp(), false) }
                } className="reset-button btn">
                    Sıfırla
                </button>
            </div>
        </div>
    )
}

export default Timer