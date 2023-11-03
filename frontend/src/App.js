import React, { useState, useEffect, useRef } from "react";
import Leaderboard from './Leaderboard'
import { useInterval } from "./useInterval";
const FIELD = [600, 600];
const SNAKE_START_POS = [
  [6, 5],
  [6, 6],
];
const APPLE_START_POS = [1, 3];
const SCALE = 40;
const SPEED = 150;
const DIRECTIONS = {
  38: [0, -1], // up
  40: [0, 1], // down
  37: [-1, 0], // left
  39: [1, 0], // right
};

function App() {
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START_POS);
  const [apple, setApple] = useState(APPLE_START_POS);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [dir, setDir] = useState([0, -1]);
  const [previousSpeed, setPreviousSpeed] = useState(null);
  const [prevScore, setPrevScore] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [name, setName] = useState("");
  useInterval(() => gameLoop(), speed);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const value = score;
    console.log("Name:", name);
    console.log("Score:", value);
    try {
      let response = await fetch("http://localhost:3001/newRec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ name, value }),
      });

      if (response.ok) {
        console.log("Success");
      } else {
      }
    } catch (error) {
      console.error(error);
    }
  };
  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
  };
  const togglePause = () => {
    if (!isGamePaused) {
      setPreviousSpeed(speed); // Сохраняем предыдущую скорость
      setSpeed(null); // Устанавливаем скорость в ноль для паузы
    } else {
      setSpeed(previousSpeed); // Восстанавливаем предыдущую скорость
    }
    setIsGamePaused(!isGamePaused);
  };
  const moveSnake = ({ keyCode }) =>
    keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]);
  const spawnApple = (values) =>
    apple.map((_a, i) => values[Math.floor(Math.random() * values.length)]);

  const checkCollision = (piece, snk = snake) => {
    if (
      piece[0] * SCALE >= FIELD[0] ||
      piece[0] < 0 ||
      piece[1] * SCALE >= FIELD[1] ||
      piece[1] < 0
    )
      return true;

    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = (newSnake) => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = spawnApple([1, 5, 10]);
      while (checkCollision(newApple, newSnake)) {
        newApple = spawnApple([1, 5, 10]);
      }
      setApple(newApple);
      incrementScore(apple[0]);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    if (isGamePaused) {
      return;
    }

    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  const startGame = () => {
    setSnake(SNAKE_START_POS);
    setApple(APPLE_START_POS);
    setDir([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
    setScore(0);
  };

  const incrementScore = (value) => {
    setScore(score + value);
    if (Math.floor((score + value) / 50) > Math.floor(prevScore / 50)) {
      setSpeed(SPEED - 15);
      setPrevScore(score + value);
    }
  };

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "black";
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = "red";
    context.fillRect(apple[0], apple[1], 1, 1);
  }, [snake, apple, gameOver]);
  return (
    <div
      role="button"
      tabIndex="0"
      onKeyDown={(e) => moveSnake(e)}
      style={{
        fontFamily: "arial",
        fontSize: "24px",
        margin: "25px",
        width: "350px",
        height: "200px",
      }}
    >
      <h1>Your score: {score}</h1>
      <canvas
        style={{ border: "1px solid black" }}
        ref={canvasRef}
        width={`${FIELD[0]}px`}
        height={`${FIELD[1]}px`}
      />
      {gameOver && (
        <>
          <div style={{ fontSize: "54px" }}>GAME OVER!</div>
          <form
            onSubmit={handleSubmit}
            style={{ width: "300px", fontSize: "24px" }}
          >
            <label style={{ fontSize: "54px" }}>
              Your name:
              <input
                type="text"
                value={name}
                style={{ display: "flex", width: "400px", height: "100px" }}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <button
              type="submit"
              style={{
                display: "flex",
                width: "300px",
                height: "300px",
                fontSize: "54px",
              }}
            >
              Send
            </button>
          </form>
        </>
      )}
      <div style={{ display: "flex" }}>
        <button
          onClick={startGame}
          style={{ width: "300px", height: "300px", fontSize: "54px" }}
        >
          Start Game
        </button>
        <button
          onClick={togglePause}
          style={{ width: "300px", height: "300px", fontSize: "54px" }}
        >
          {isGamePaused ? "Resume Game" : "Pause Game"}
        </button>
      </div>
      <Leaderboard />
    </div>
  );
}

export default App;
