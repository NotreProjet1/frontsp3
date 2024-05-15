  import React, { useState, useEffect, useRef } from 'react';
  import { useParams } from 'react-router-dom';
  import axios from 'axios';
  import { Card, Button, Form } from 'react-bootstrap';
  import html2canvas from 'html2canvas';
  import jsPDF from 'jspdf';
  import { MDBIcon } from 'mdb-react-ui-kit'; // Assurez-vous d'utiliser le bon nom de package
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faAward } from '@fortawesome/free-solid-svg-icons';

  function QuizDetail() {
    const { id_q } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [showToast, setShowToast] = useState(false);
    const [isAnswerSelected, setIsAnswerSelected] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);
    const percentageScore = ((score / (questions.length * 2)) * 100).toFixed(2);
    const [certificateDetails, setCertificateDetails] = useState({
      firstName: '',
      lastName: '',
      date: new Date().toLocaleDateString(),
      companyName: 'EduPionner',
      percentageScore: ''
    });
    const certificateRef = useRef();

    useEffect(() => {
      async function fetchQuiz() {
        try {
          const response = await axios.get(`http://localhost:3000/quiz/getQuizById/${id_q}`);
          setQuiz(response.data.Quiz);
        } catch (error) {
          console.error('Error fetching quiz:', error);
        }
      }
      fetchQuiz();
    }, [id_q]);

    useEffect(() => {
      async function fetchQuestions() {
        try {
          const response = await axios.get(`http://localhost:3000/question/gestionQuiz/${id_q}`);
          setQuestions(response.data.questions);
        } catch (error) {
          console.error('Error fetching questions:', error);
        }
      }
      fetchQuestions();
    }, [id_q]);

    useEffect(() => {
      // Récupérer les données du participant depuis le localStorage
      const participantData = JSON.parse(localStorage.getItem('participantData'));
      if (participantData) {
        setCertificateDetails({
          firstName: participantData.nom,
          lastName: participantData.prenom,
          date: new Date().toLocaleDateString(),
          companyName: 'EduPionner',
          percentageScore: percentageScore
        });
      }
    }, []);

    const handleAnswerChange = (answerId) => {
      setAnswers({ ...answers, [currentQuestionIndex]: answerId });
      setIsAnswerSelected(true);
    };

    const handleNextQuestion = () => {
      if (isAnswerSelected) {
        setCurrentQuestionIndex(current => current + 1);
        setIsAnswerSelected(false);
      } else {
        alert('Veuillez sélectionner une réponse avant de passer à la question suivante.');
      }
    };

    const handleSubmit = () => {
      let totalScore = 0;
      questions.forEach((question, index) => {
        const correctAnswer = question.reponse_correct;
        const selectedAnswer = answers[index];
        if (correctAnswer === selectedAnswer) {
          totalScore += 2;
        } else {
          totalScore += 0;
        }
      });
      setScore(totalScore);
      setShowToast(true);
    };

    const handleCertificateClick = () => {
      setShowCertificate(true);
    };

    const handleDownloadCertificate = () => {
      html2canvas(certificateRef.current, { scrollY: -window.scrollY }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'px', [canvas.width, canvas.height]);
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('certificate.pdf');
      });
    };
    

    return (
      <div>
        <style>{`  
.certificate-image {
  width: 80%;
  height: 90%;
  border: 5px solid #031136;
  margin: auto; /* Centre l'élément horizontalement */
  margin-top: 50px; /* Ajoute une marge de 50px en haut */
}

    
    

          .certificate-header {
            display: flex;
            align-items: center;
          }

          .certificate-icon {
            width: 50px;
            height: 50px;
            margin-right: 20px;
          }

          .certificate-title {
            font-weight: bold;
            color: blue;
            text-align: center; /* Pour centrer horizontalement */
            margin-top: 20px; /* Ajoute un peu d'espace au-dessus */
            margin-left: 200px; /* Ajoute une marge à gauche */
          }
          
          

          .certificate-hr {
            border: 1px solid blue;
            margin: 20px 0;
            text-align: center;margin-left: 250px;          }

            .certificate-body {
              font-size: 18px;
              color: blue;
             
              padding: 20px; /* Ajoutez un peu d'espace pour le contenu */
            }
            

          .certificate-text {
            margin-bottom: 10px;
          }
          .certificate-prenom {
            margin-left: 580px;   
          }
          
        `}</style>
       {!showCertificate && quiz && (
          <div className="quiz-card text-center mb-4">
            <h1 style={{ color: 'blue', textDecoration: 'underline' }}>{quiz.titre}</h1>
            <p style={{ color: 'blue' }}>{quiz.description}</p>
          </div>
        )}

        {showCertificate ? (
        <div className="certificate-image" > 
          <div className="certificate" style={{marginTop:'30px'}} ref={certificateRef}>
            <div className="certificate-container"> 
         
              <div className="certificate-header"> 
            
                <img src='/images/certiflogo.png' alt='logo' className='logo' style={{  width: '250px', height:'200px', marginRight: '10px',  marginLeft:'40px'}}  />
              {/* <FontAwesomeIcon icon={faAward} style={{ color: 'blue', fontSize: '150px', marginRight: '10px',  marginLeft:'40px'}} /> */}
                <h2 className="certificate-title">Certificat de compétence</h2>
                {/* <FontAwesomeIcon icon={faAward} style={{ color: 'blue', fontSize: '150px', marginRight: '60px', marginLeft:'400px' }} /> */}
                <img src='/images/iconecertif.png' alt='logo' className='logo' style={{  width: '250px', height:'200px', marginRight: '10px',  marginLeft:'40px'}}  />
              </div>
              <hr className="certificate-hr" style={{width:'70%'}} />
              <div className="certificate-body">
                <p className="certificate-prenom"> {certificateDetails.firstName} {certificateDetails.lastName}</p>
                <hr className="certificate-hr" style={{width:'70%'}} />
                <p className="certificate-text">
          <span style={{marginLeft: '20%'}}>Date:</span> {certificateDetails.date} <span style={{marginLeft: '50%'}}>Pourcentage de score:</span> {certificateDetails.score}%
        </p>
              
        {/* Exemple de signature générée automatiquement */}
        <div className="enterprise-signature" style={{ textAlign: 'center', marginTop: '60px' }}>
          <p>  {certificateDetails.companyName}</p>
          {/* Cache pour l'exemple de signature */}
          <img src="/images/signature.avif"  style={{ width: '300px', height: '100px', margin: '0 auto' }} />
        </div>
              </div>
            </div>
          </div>   </div>
        ) : (
          <div className="quiz-container">
            {currentQuestionIndex < questions.length && (
              <Card className="question-card">
                <Card.Body>
                  <div className="question-container">
                    <h3 className="question">{questions[currentQuestionIndex].question}</h3>
                    <div className="answer-options">
                      <div className="answer-option">
                        <input
                          type="radio"
                          id={`question${currentQuestionIndex}_correct`}
                          name={`question${currentQuestionIndex}`}
                          value={questions[currentQuestionIndex].reponse_correct}
                          checked={answers[currentQuestionIndex] === questions[currentQuestionIndex].reponse_correct}
                          onChange={() => handleAnswerChange(questions[currentQuestionIndex].reponse_correct)}
                        />
                        <label htmlFor={`question${currentQuestionIndex}_correct`} className="answer-label">
                          {questions[currentQuestionIndex].reponse_correct}
                        </label>
                      </div>
                      <div className="answer-option">
                        <input
                          type="radio"
                          id={`question${currentQuestionIndex}_incorrect`}
                          name={`question${currentQuestionIndex}`}
                          value={questions[currentQuestionIndex].reponse_incorect}
                          checked={answers[currentQuestionIndex] === questions[currentQuestionIndex].reponse_incorect}
                          onChange={() => handleAnswerChange(questions[currentQuestionIndex].reponse_incorect)}
                        />
                        <label htmlFor={`question${currentQuestionIndex}_incorrect`} className="answer-label">
                          {questions[currentQuestionIndex].reponse_incorect}
                        </label>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            )}
            {currentQuestionIndex < questions.length && (
              <Button onClick={handleNextQuestion} className="next-button">Suivant</Button>
            )}
            {currentQuestionIndex === questions.length && (
              <div className="button-container">
                <Button onClick={handleSubmit} className="submit-button">Terminer</Button>
                <Button onClick={handleCertificateClick} className="certificate-button">Obtenir le certificat</Button>
              </div>
            )}
            <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3JzZzkwNW5oNnZpc2lnajZrNzBnYW9qajFsZ3hiZmZqb3ZpcDZ6ZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8zjxfpuutpJFRnlM2h/200.webp" alt="gif" className="quiz-image" />
          </div>
        )}

        {score > 0 && <p  style={{marginTop:'20px'}}>Votre score: {score}/{questions.length * 2}</p>}

        {showToast && (
          <div className="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Résultat</strong>
            </div>
            <div className="toast-body">
              {score}/{questions.length * 2} - Votre score est de {score}.
            </div>
          </div>
        )}

        {showCertificate && (
          <Button onClick={handleDownloadCertificate} className="download-button">Télécharger le certificat en PDF</Button>
        )}
      </div>
    );
  }

  export default QuizDetail;
