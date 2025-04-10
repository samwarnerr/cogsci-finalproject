import React from "react";
import "./ResultsScreen.css";

const ResultsScreen = ({ results, fontCodename }) => {
  const totalQuestions = results.length;
  const correctAnswers = results.filter((r) => r.correct).length;

  const surveyUrl = `https://docs.google.com/forms/d/e/1FAIpQLScQ4pAPNkTClsIhmHRjLihQTo0VWF-sIv9VQIO59cmhJOtztQ/viewform?usp=pp_url&entry.1996164500=${fontCodename}`;
  const percentage = (correctAnswers / totalQuestions) * 100;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="results-container centered">
      <h2>Quiz Completed!</h2>

      <div className="progress-wrapper">
        <svg width="140" height="140">
          <circle
            className="progress-bg"
            stroke="#2c2c2c"
            fill="transparent"
            strokeWidth="12"
            r={radius}
            cx="70"
            cy="70"
          />
          <circle
            className="progress"
            stroke="#8A7FFF"
            fill="transparent"
            strokeWidth="12"
            strokeLinecap="round"
            r={radius}
            cx="70"
            cy="70"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
            fontSize="20"
            fill="#ffffff"
          >
            {correctAnswers}/5
          </text>
        </svg>
      </div>

      <p>Please complete one last step:</p>
      <p>Click below to fill out a brief survey</p>

      <a
        href={surveyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="survey-button"
      >
        Take the Survey
      </a>
    </div>
  );
};

export default ResultsScreen;
