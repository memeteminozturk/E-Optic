import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { loadTimerData, saveTimerData, clearTimerData } from "../utils/storage";

export function useCountdownTimer(initialMs, resetTrigger) {
    const initialSeconds = Math.ceil(initialMs / 1000);

    const [secondsLeft, setSecondsLeft] = useState(() => {
        const saved = loadTimerData();
        return saved?.secondsLeft ?? initialSeconds;
    });
    const [isRunning, setIsRunning] = useState(false);  // <-- always false initially

    const intervalRef = useRef(null);
    const prevResetRef = useRef(resetTrigger);

    useEffect(() => {
        saveTimerData({ secondsLeft });
    }, [secondsLeft]);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft((s) => {
                    if (s <= 1) {
                        clearInterval(intervalRef.current);
                        setIsRunning(false);
                        toast.error("Zaman doldu!");
                        return 0;
                    }
                    return s - 1;
                });
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    useEffect(() => {
        if (prevResetRef.current !== resetTrigger) {
            prevResetRef.current = resetTrigger;
            clearInterval(intervalRef.current);
            setSecondsLeft(initialSeconds);
            setIsRunning(false);
            clearTimerData();
        }
    }, [resetTrigger, initialSeconds]);

    const start = useCallback(() => setIsRunning(true), []);
    const pause = useCallback(() => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
    }, []);
    const reset = useCallback(() => {
        clearInterval(intervalRef.current);
        setSecondsLeft(initialSeconds);
        setIsRunning(false);
        clearTimerData();
    }, [initialSeconds]);

    return { secondsLeft, isRunning, start, pause, reset };
}
