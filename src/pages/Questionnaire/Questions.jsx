import React, { useState } from 'react';
import './Questions.css';
import {Link} from "react-router-dom";

const Questions = () => {
    const [error, setError] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    'Какое ваше любимое аниме?',
    'Какой жанр аниме вам больше нравится?',
    'Кто ваш любимый аниме-персонаж?',
    'Какой последний аниме-сериал вы смотрели?',
    'Какое аниме вы бы порекомендовали другим?'
  ];

  const handleAnswerChange = (e) => {
    setAnswers({ ...answers, [step]: e.target.value });
    setError(false);
  };

  const handleNext = () => {
    console.log(answers[step])
    if (answers[step]?.trim() === undefined) {
      setError(true);
      return;
    }
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setSubmitted(false);
    setError(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {submitted ? (
          <>
            <h2>Результаты опроса</h2>
            <ul>
              {questions.map((question, index) => (
                <li key={index}>
                  <strong>{question}</strong> <br />Ответ: {answers[index]}
                </li>
              ))}
            </ul>
            <div className="modal-buttons">
              <button className="modal-btn" onClick={handleNext}>Еще раз!</button>
              <Link className="close" to="/">Закрыть</Link>
            </div>
          </>
        ) : (
            <>
              <h2>Аниме опрос</h2>
              <p>{questions[step]}</p>
              <input
                  type="text"
                  value={answers[step] || ''}
                  placeholder="Ваш ответ"
              onChange={handleAnswerChange}
            />
            {error && <p className="error">Пожалуйста, введите ответ.</p>}
            <div className="modal-buttons">
              <button className="modal-btn" onClick={handleNext}>
                {step < questions.length - 1 ? 'Далее' : 'Завершить'}
              </button>
              <Link className="close" to="/">Закрыть</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Questions;
