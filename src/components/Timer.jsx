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

        const timer = new Date();
        timer.setTime(timer.getTime() + time);
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

    const formatTime = (h, m, s) => {
        const pad = (n) => n.toString().padStart(2, "0");
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
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
        document.title = isRunning
            ? formatTime(hours, minutes, seconds) + " - Sanal Optik"
            : "Sanal Optik";
    }, [isRunning, hours, minutes, seconds]);

    const handleReset = () => {
        localStorage.removeItem("savedTime");
        restart(getExpiryTimestamp(), false);
    };

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
                <button className="reset-button btn" onClick={handleReset} >
                    Sıfırla
                </button>
            </div>
        </div>
    );
};

export default Timer;
