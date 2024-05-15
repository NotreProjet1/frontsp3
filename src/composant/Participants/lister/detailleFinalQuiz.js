import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DetailQuizFinal = () => {
    const [quizDetail, setQuizDetail] = useState(null);
    const [userResponses, setUserResponses] = useState({});
    const { id_Q } = useParams();

    useEffect(() => {
        async function fetchQuiz() {
            try {
                const response = await axios.get(`http://localhost:3000/quizFinal/${id_Q}`);
                setQuizDetail(response.data);
            } catch (error) {
                console.error('Error fetching quiz:', error);
            }
        }
        fetchQuiz();
    }, [id_Q]);

    const handleCheckboxChange = (responseId, isCorrect) => {
        setUserResponses(prevResponses => ({
            ...prevResponses,
            [responseId]: isCorrect ? 2 : 0
        }));
    };

    const calculateScore = () => {
        let score = 0;
        Object.values(userResponses).forEach(responseScore => {
            score += responseScore;
        });
        return score;
    };

    if (!quizDetail) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{quizDetail.quiz.Titre}</h1>
            <p>Description: {quizDetail.quiz.description}</p>
            <h2>Questions</h2>
            {quizDetail.questionsWithAnswers.map(question => (
                <div key={question.question.id_question}>
                    <h2>{question.question.questions}</h2>
                    {question.reponses.map(reponse => (
                        <div key={reponse.id_rep}>
                            <input
                                type="checkbox"
                                value={reponse.id_rep}
                                onChange={() => handleCheckboxChange(reponse.id_rep, reponse.Correct > 0)}
                            />
                            <label>{reponse.Correct}</label>
                            <input
                                type="checkbox"
                                value={reponse.id_rep}
                                onChange={() => handleCheckboxChange(reponse.id_rep, false)}
                            />
                            <label>{reponse.incorect1}</label>
                            <input
                                type="checkbox"
                                value={reponse.id_rep}
                                onChange={() => handleCheckboxChange(reponse.id_rep, false)}
                            />
                            <label>{reponse.incorect2}</label>
                            <input
                                type="checkbox"
                                value={reponse.id_rep}
                                onChange={() => handleCheckboxChange(reponse.id_rep, false)}
                            />
                            <label>{reponse.incorect3}</label>
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={() => console.log('Score:', calculateScore())}>Calculer le score</button>
        </div>
    );
};

export default DetailQuizFinal;
