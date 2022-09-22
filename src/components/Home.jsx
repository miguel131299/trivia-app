import "../styles/Home.css";

export default function Home(props) {
  return (
    <div className="home-container">
      <div className="home--title-container">
        <h1 className="home--title">Quizzical</h1>
        <p className="home--description">
          This is the #1 Trivia Game made by myself
        </p>
      </div>
      <button
        className="home--button standard-button"
        onClick={props.buttonClick}
      >
        Start Quiz!
      </button>
    </div>
  );
}
