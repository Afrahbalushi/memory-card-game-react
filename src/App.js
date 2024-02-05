import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const images = [
  '🐱', '🐶', '🐭', '🐹',
  '🐰', '🦊', '🐻', '🐼',
  '🦁', '🐯', '🐨', '🐵',
];

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App = () => {
  const [cards] = useState(shuffleArray([...images, ...images]));
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [timer, setTimer] = useState(90);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    let timerInterval;

    if (gameStarted) {
      timerInterval = setInterval(() => {
        if (timer > 0 && matchedPairs.length !== cards.length / 2) {
          setTimer((prev) => prev - 1);
        } else {
          clearInterval(timerInterval);
          setGameOver(true);
        }
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [timer, matchedPairs, cards, gameStarted]);

  useEffect(() => {
    if (flippedIndexes.length === 2) {
      const [index1, index2] = flippedIndexes;
      if (cards[index1] === cards[index2]) {
        setMatchedPairs((prev) => [...prev, cards[index1]]);
      }
      setTimeout(() => setFlippedIndexes([]), 1000);
    }
  }, [flippedIndexes, cards]);

  const handleCardClick = (index) => {
    if (gameStarted && flippedIndexes.length < 2 && !flippedIndexes.includes(index) && !matchedPairs.includes(cards[index])) {
      setFlippedIndexes((prev) => [...prev, index]);
      setMoves((prevMoves) => prevMoves + 1);
    }
  };

  const handleStartClick = () => {
    setGameStarted(true);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Memory Card Game</h1>
      <div className="row">
        <div className="col-12 mb-3">
          <div className="text-center">
            <h2 id='time'>Time Remaining: {timer} seconds</h2>
            <h2 id='move'>Moves: {moves}</h2>
            {!gameStarted && <button onClick={handleStartClick}>Start Game</button>}
            {gameOver && matchedPairs.length !== cards.length / 2 && (
              <div>
                <h3 id='red'>Game Over</h3>
                <p>Total Moves: {moves}</p>
              </div>
            )}
            {matchedPairs.length === cards.length / 2 && (
              <div>
                <h3 id='green'>Win!</h3>
                <p>Total Moves: {moves}</p>
              </div>
            )}
          </div>
        </div>
        {cards.map((card, index) => (
          <div key={index} className="col-4 col-md-3 col-lg-2 mb-3">
            <div
              onClick={() => handleCardClick(index)}
              className={`card h-100 text-white text-center ${
                flippedIndexes.includes(index) || matchedPairs.includes(card) ? 'flipped' : ''
              }`}
            >
              <div className="card-body d-flex align-items-center justify-content-center">
                {flippedIndexes.includes(index) || matchedPairs.includes(card) ? (
                  <span className="text-4xl">{card}</span>
                ) : (
                  <span className="text-4xl">🎴</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
