import React, { useState } from 'react';
import classes from "./Questionnaire.module.css"


// TODO: REFACTOR
const Questionnaire = ({ closeModal }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    const questions = [
        'Кто твой любимый персонаж аниме?',
        'Какое аниме ты считаешь лучшим?',
        'Какой жанр аниме тебе нравится больше всего?',
        'Какое аниме ты смотрел(а) последним?',
        'Сколько времени ты обычно уделяешь просмотру аниме в неделю?',
    ];

    const handleAnswerChange = (event) => {
        const newAnswers = [...answers];
        newAnswers[step] = event.target.value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        setSubmitted(true);
    };

    const handleNextQuestion = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            handleSubmit();
        }
    };

    return (
        <div className={classes.Modal}>
            <div className={classes.ModalContent}>
                {submitted ? (
                    <div>
                        <h2>Ваши ответы:</h2>
                            {answers.map((answer, index) => (
                                <p key={index}>
                                    {questions[index]} {answer}
                                </p>
                            ))}
                        <button onClick={closeModal}>Закрыть</button>
                    </div>
                ) : (
                    <div>
                        <h2>Аниме Опрос</h2>
                        <p>{questions[step]}</p>
                        <input
                            type="text"
                            value={answers[step] || ''}
                            onChange={handleAnswerChange}
                            placeholder="Ваш ответ"
                        />
                        <div>
                            {step < questions.length - 1 ? (
                                <button className={classes.next} onClick={handleNextQuestion}>Следующий вопрос</button>
                            ) : (
                                <button className={classes.next} onClick={handleSubmit}>Завершить опрос</button>
                            )}
                            <button onClick={closeModal}>Отмена</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Questionnaire;
