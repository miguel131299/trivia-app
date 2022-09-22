import "../styles/Question.css";
import { nanoid } from "nanoid";
import { htmlToText } from "html-to-text";

export default function Question(props) {
  const buttonElements = props.answers.map((answer) => {
    return (
      <button
        className={"question--button " + answer.state}
        key={nanoid()}
        onClick={(event) => props.selectAnswer(event, props.id)}
      >
        {htmlToText(answer.text)}
      </button>
    );
  });

  return (
    <div className="question-container">
      <h2>{htmlToText(props.question)}</h2>
      <div className="question--answer-container">{buttonElements}</div>
    </div>
  );
}
