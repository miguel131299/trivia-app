import { useState, useEffect } from "react";
import "../styles/Quizz.css";
import Question from "./Question";
import { htmlToText } from "html-to-text";
import { nanoid } from "nanoid";

export default function Quizz() {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [gameID, setGameID] = useState(0);

  function getQuestionInfo(data) {
    return data.results.map((elem) => {
      return {
        question: elem.question,
        correct_answer: elem.correct_answer,
        incorrect_answers: elem.incorrect_answers,
        id: nanoid(),
      };
    });
  }

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5")
      .then((res) => res.json())
      .then((data) => {
        const info = getQuestionInfo(data);
        setQuestions(info);
        setSelectedAnswers(
          info.map((elem) => {
            const answers = getPossibleAnswers(elem).map((answer) => ({
              text: answer,
              state: "unselected",
            }));

            return {
              id: elem.id,
              question: elem.question,
              correct_answer: elem.correct_answer,
              answers: answers,
            };
          })
        );
      });
  }, [gameID]);

  function getPossibleAnswers(elem) {
    const answers = [...elem.incorrect_answers, elem.correct_answer];
    return shuffle(answers);
  }

  function selectAnswer(event, id) {
    const element = event.target;
    // update answer state
    setSelectedAnswers((prevAnswers) => {
      // iterate through questions
      return prevAnswers.map((questionData) => {
        if (questionData.id === id) {
          // iterate through answers
          const newAnswers = questionData.answers.map((answer) => {
            if (htmlToText(answer.text) === element.innerText) {
              return { ...answer, state: "selected" };
            } else {
              return { ...answer, state: "unselected" };
            }
          });

          return { ...questionData, answers: newAnswers };
        } else {
          return questionData;
        }
      });
    });
  }

  function checkAnswers() {
    setSelectedAnswers((prevAnswers) => {
      // iterate through questions
      return prevAnswers.map((questionData) => {
        // iterate through answers
        const newAnswers = questionData.answers.map((answer) => {
          if (answer.text === questionData.correct_answer) {
            if (answer.state === "selected") {
              setScore((prevScore) => prevScore + 0.5);
            }
            return { ...answer, state: "correct" };
          } else if (answer.state === "selected") {
            return { ...answer, state: "incorrect" };
          } else {
            return { ...answer, state: "unselected" };
          }
        });

        return { ...questionData, answers: newAnswers };
      });
    });

    setShowScore(true);
  }

  const questionElements = selectedAnswers.map((elem) => {
    return (
      <Question
        question={elem.question}
        answers={elem.answers}
        key={elem.id}
        id={elem.id}
        selectAnswer={selectAnswer}
      />
    );
  });

  function restartGame() {
    setScore(0);
    setShowScore(false);
    setGameID((prev) => prev + 1);
  }

  return (
    <div className="quizz-container">
      <div className="quizz--question-container">{questionElements}</div>
      {showScore ? (
        <div className="quizz--score-container">
          <p>You scored {score}/5 correct answers</p>
          <button
            className="quizz--button standard-button"
            onClick={restartGame}
          >
            Play Again
          </button>
        </div>
      ) : (
        <button
          className="quizz--button standard-button"
          onClick={checkAnswers}
        >
          Check Answers
        </button>
      )}
    </div>
  );
}
