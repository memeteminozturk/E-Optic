import React from 'react'
import Timer from '../../components/Timer'
import "../../App.css"
import { useSelector } from 'react-redux'

const OpticPage = () => {

    const optic = useSelector((state) => state.optic);

    const options = ["A", "B", "C", "D", "E"];

    const handleClick = (e) => {
        const button = e.target;

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
        <div className="optic-page">
            <div className="container optic-page-container">
                <h1 className="title">{optic.name}</h1>
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
                            <Timer time={optic.examTime} />
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
                                                {options.map((option, index) => (
                                                    <li key={index} className="option">
                                                        <button onClick={handleClick}>{option}</button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            ) :
                                optic.subjects.map((subject, index) => (
                                    <div key={index} className="optic-subject">
                                        <h2 className="optic-subject-title">{subject.name}</h2>
                                        <ul className="list">
                                            {[...Array(subject.questionCount)].map((item, index) => (
                                                <li key={index} className="list-item">
                                                    <p className="question-no">{index + 1}</p>
                                                    <ul className="options">
                                                        {options.map((option, index) => (
                                                            <li key={index} className="option">
                                                                <button onClick={handleClick}>{option}</button>
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
    )
}

export default OpticPage