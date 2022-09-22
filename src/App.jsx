import { useState, useEffect } from "react";
import "./App.css";
import Home from "./components/Home";
import Quizz from "./components/Quizz";

function App() {
  const [playingGame, setPlayingGame] = useState(false);

  function startGame() {
    setPlayingGame(true);
  }

  return (
    <div className="App">
      {playingGame ? <Quizz /> : <Home buttonClick={startGame} />}
    </div>
  );
}

export default App;
