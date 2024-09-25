import React, { useEffect } from "react";
import "../App.css";
import { useTimer } from "react-timer-hook";
import toast from "react-hot-toast";

const Timer = ({ time, resetTimer }) => {
    // time is in milliseconds, convert to date object
    const getExpiryTimestamp = () => {
        const savedTime = localStorage.getItem("savedTime");
        if (savedTime) {
            return new Date(JSON.parse(savedTime));
        }

        let timer = new Date();
        let timerHours = time / 3600000;
        let timerMinutes = (time % 3600000) / 60000;
        let timerSeconds = (time % 60000) / 1000;
        timer.setHours(timer.getHours() + timerHours);
        timer.setMinutes(timer.getMinutes() + timerMinutes);
        timer.setSeconds(timer.getSeconds() + timerSeconds);
        return timer;
    };

    const {
        seconds,
        minutes,
        hours,
        isRunning,
        start,
        pause,
        restart
    } = useTimer({
        expiryTimestamp: getExpiryTimestamp(),
        onExpire: () => toast.error("Süreniz doldu!"),
        autoStart: false
    });

    const formatTime = (hours, minutes, seconds) => {
        hours = hours.toString().padStart(2, "0");
        minutes = minutes.toString().padStart(2, "0");
        seconds = seconds.toString().padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    };

    // Zamanı yerel depolamaya kaydet
    useEffect(() => {
        if (isRunning) {
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + hours);
            expiryDate.setMinutes(expiryDate.getMinutes() + minutes);
            expiryDate.setSeconds(expiryDate.getSeconds() + seconds);

            localStorage.setItem("savedTime", JSON.stringify(expiryDate));
        }
    }, [hours, minutes, seconds, isRunning]);

    // Sayfa yenilendiğinde ya da sıfırlama tetiklendiğinde timer'ı sıfırlar
    useEffect(() => {
        if (resetTimer) {
            localStorage.removeItem("savedTime");
            restart(getExpiryTimestamp(), false); // Zamanlayıcıyı yeniden başlatır
        }
    }, [resetTimer]);

    useEffect(() => {
        if (isRunning) {
            document.title = formatTime(hours, minutes, seconds) + " - Sanal Optik";
        } else {
            document.title = "Sanal Optik";
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
                    <button className="start-button btn" onClick={start}>
                        Başlat
                    </button>
                ) : (
                    <button className="stop-button btn" onClick={pause}>
                        Durdur
                    </button>
                )}
                <button onClick={() => {
                    localStorage.removeItem("savedTime");
                    restart(getExpiryTimestamp(), false);
                }} className="reset-button btn">
                    Sıfırla
                </button>
            </div>
        </div>
    );
};

export default Timer;
