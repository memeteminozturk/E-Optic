import React, { useEffect, useState } from 'react';
import Timer from '../../components/Timer';
import "../../App.css";
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';

const OpticPage = () => {
    const optic = useSelector((state) => state.optic);
    const options = ["A", "B", "C", "D", "E"];
    
    // LocalStorage'dan seçilen şıkları al
    const [selectedAnswers, setSelectedAnswers] = useState(() => {
        const savedAnswers = localStorage.getItem('selectedAnswers');
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
        localStorage.setItem('selectedAnswers', JSON.stringify(updatedAnswers));
    };

    const clearAnswers = () => {
        setSelectedAnswers({});
        localStorage.removeItem('selectedAnswers');
        setResetTimer(true);
        setTimeout(() => {
            setResetTimer(false);
        }, 1000); // 1 saniye sonra resetTimer'ı false yap
    }

    return (
        <div className="optic-page">
            <div className="container optic-page-container">
                <div className="optic-header">
                    <h1 className="title">{optic.name}</h1>
                    <button className="btn" onClick={clearAnswers} title="Tüm cevapları temizle">
                        <FontAwesomeIcon icon={faRedo} />
                    </button>
                </div>
                <div className="optic-group">
                    <div className="subtitles">
                        <p className="subtitle">
                            <span className="passive">Sınav süresi:</span> {optic.examTime / 60 / 1000} dakika
                        </p>
                        <p className="subtitle">
                            <span className="passive">Soru sayısı:</span> {optic.questionCount ? optic.questionCount : optic.subjects.reduce((acc, subject) => acc + subject.questionCount, 0)}
                        </p>
                        <div className="subtitle">
                            {/* süreyi başlat */}
                            <Timer time={optic.examTime} resetTimer={resetTimer} />
                            {/* clearAnswers fonksiyonunu çağır */}
                        </div>
                    </div>
                    {/* for loop */}
                    <div className="optic-subjects">
                        {
                            optic.examType === "singleSubject" ? (
                                <ul className="list">
                                    {[...Array(optic.questionCount)].map((item, index) => (
                                        <li key={index} className="list-item">
                                            <p className="question-no">{index + 1}</p>
                                            <ul className="options">
                                                {options.map((option, optionIndex) => (
                                                    <li key={optionIndex} className="option">
                                                        <button
                                                            className={selectedAnswers[index] === option ? "active" : ""}
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
                            ) :
                                optic.subjects.map((subject, subjectIndex) => (
                                    <div key={subjectIndex} className="optic-subject">
                                        <h2 className="optic-subject-title">{subject.name}</h2>
                                        <ul className="list">
                                            {[...Array(subject.questionCount)].map((item, questionIndex) => (
                                                <li key={questionIndex} className="list-item">
                                                    <p className="question-no">{questionIndex + 1}</p>
                                                    <ul className="options">
                                                        {options.map((option, optionIndex) => (
                                                            <li key={optionIndex} className="option">
                                                                <button
                                                                    className={selectedAnswers[`${subjectIndex}-${questionIndex}`] === option ? "active" : ""}
                                                                    onClick={() => handleClick(`${subjectIndex}-${questionIndex}`, option)}
                                                                >
                                                                    {option}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OpticPage;
