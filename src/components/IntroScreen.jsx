import React from "react";
import "./IntroScreen.css";

const IntroScreen = ({ onStart, font }) => {
  return (
    <div className={`intro-container font-${font}`}>
      <h1>Welcome!</h1>
      <p>
        This short quiz contains 5 quick multiple-choice questions. Please read each one carefully and answer as quickly and accurately as you can.
      </p>
      <p>
        This quiz is part of a research study on interface readability and usability.
      </p>
      <button className={`start-button font-${font}`} onClick={onStart}>
        Start Quiz
        </button>
    </div>
  );
};

export default IntroScreen;
