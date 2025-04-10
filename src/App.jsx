import { useState, useEffect } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import ResultsScreen from "./components/ResultsScreen";
import IntroScreen from "./components/IntroScreen";


import "./App.css";

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [time, setTime] = useState(10);
  const [results, setResults] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [font, setFont] = useState("inter");
  const [quizStarted, setQuizStarted] = useState(false);
  const [fontCodename, setFontCodename] = useState("national");

  const quizData = [
    {
      question: "Which of the following animals is NOT a mammal?",
      answers: ["Dolphin", "Bat", "Penguin", "Elephant"],
      correct: "Penguin",
    },
    {
      question: "Which planet is known as the Red Planet?",
      answers: ["Earth", "Mars", "Jupiter", "Venus"],
      correct: "Mars",
    },
    {
      question: "What is the capital of France?",
      answers: ["Berlin", "Madrid", "Paris", "Rome"],
      correct: "Paris",
    },
    {
      question: "What gas do plants absorb from the atmosphere?",
      answers: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
      correct: "Carbon Dioxide",
    },
    {
      question: "Which number is a prime number?",
      answers: ["4", "6", "9", "7"],
      correct: "7",
    },
  ];

  useEffect(() => {
    const fontMap = {
      national: "inter",
      sunny: "merriweather",
      train: "raleway",
    };
  
    const id = new URLSearchParams(window.location.search).get("id");
    const mappedFont = fontMap[id];
    
  
    if (mappedFont) {
      setFont(mappedFont);
      setFontCodename(id);
    } else {
      setFont("inter"); // fallback
      setFontCodename("national");
    }
  }, []);
  

  useEffect(() => {
    if (quizStarted && time > 0 && selected === null) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [quizStarted, time, selected]);
  

  const currentQuestion = quizData[currentIndex];
  const question = currentQuestion.question;
  const answers = currentQuestion.answers;
  const correctAnswer = currentQuestion.correct;
  

  const handleAnswer = (answer) => {
    if (selected) return;
  
    const correct = answer === correctAnswer;
    setSelected(answer);
    setIsCorrect(correct);
  
    const timeTaken = Date.now() - questionStartTime;
  
    const updatedResults = [
      ...results,
      {
        question: currentQuestion.question,
        selected: answer,
        correct: correct,
        timeTaken: timeTaken,
      },
    ];
    setResults(updatedResults);
  
    setTimeout(async () => {
      if (currentIndex + 1 < quizData.length) {
        setCurrentIndex(currentIndex + 1);
        setSelected(null);
        setIsCorrect(null);
        setTime(10);
        setQuestionStartTime(Date.now());
      } else {
        setQuizCompleted(true); // Mark the quiz as completed
        try {
          await addDoc(collection(db, "quizResults"), {
            results: updatedResults,
            font: font,
            submittedAt: serverTimestamp(),
          });
        } catch (error) {
          console.error("Error saving quiz results:", error);
        }
      }
    }, 1000);
  };
  
  

  return (
    <div className={`quiz-container font-${font}`}>
      {!quizStarted ? (
        <IntroScreen onStart={() => {
          setQuizStarted(true); 
          setQuestionStartTime(Date.now());
        }} font={font}
        />
      ) : quizCompleted ? (
        <ResultsScreen results={results} fontCodename={fontCodename} />
      ) : (
        <div className={`quiz-box font-${font}`}>
          <div className="question-number">Question {currentIndex + 1}</div>
          <h1
            className={`question font-${font} ${
              selected ? (isCorrect ? "correct" : "incorrect") : ""
            }`}
          >
            {question}
          </h1>
  
          <div className="timer">
            <div className="circle">{time}</div>
          </div>
  
          <div className="answers">
            {answers.map((answer, idx) => {
              let buttonClass = "answer-button";
  
              if (selected === answer) {
                buttonClass += isCorrect
                  ? " correct-answer"
                  : " incorrect-answer";
              }
  
              return (
                <button
                  key={idx}
                  className={`${buttonClass} font-${font}`}
                  onClick={() => handleAnswer(answer)}
                  disabled={selected !== null}
                >
                  {answer}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
  
    
}

export default App;