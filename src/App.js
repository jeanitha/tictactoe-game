import React, { useState, useEffect } from "react";

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function Square({ value, onSquareClick }) {
  // const [value, setValue] = useState(null);
  // null is the initial value of the useState
  // "value" stores the value
  // "setValue" can change the value

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (value) {
      setIsVisible(true);
    }
  }, [value]);

  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null))
  // creates an array with 9 elements and set each of them to null

  useEffect(() => {
    if (!xIsNext && !calculateWinner(squares)) {
      const botMove = getBotMove(squares);
      setTimeout(() => {
        const nextSquares = squares.slice();
        nextSquares[botMove] = "O";
        setSquares(nextSquares);
        setXIsNext(true);
      }, 500); // Adjust the delay time (in milliseconds) as desired
    }
  }, [squares, xIsNext]);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    if (winner === "X") {
      status = "Congratulations, you won!"
    }
    else {
      status = "The bot won! Try again? ";
    }
  } else if (squares.every(item => item !== null)) {
    status = "Game Over. Try again?";
  } else {
    status = "Next player: " + (xIsNext ? "You" : "Bot");
  }

  function restartGame() {
    window.location.reload();
  }

  return (
    <>
      <div className="headings">
        <h1 className="title">Tic Tac Toe Game</h1>
        <div className="typewriter">
          <h2 className="subtitle">Can You beat the bot?</h2>
        </div>
        <div className="status">{status}</div>
      </div>
      <div className="board">
        <div className="board-row">
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
          <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
          <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
        </div>
        <div className="board-row">
          <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
          <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
          <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
        </div>
        <div className="board-row">
          <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
          <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
          <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
        </div>
      </div>
      <div className="txt-container">
        <p className="explanation">This game is created using React.js.</p>
        <p className="explanation-1">To see the source code or see more of my projects,</p>
        <a href="https://portfolio-website-jeanithas-projects.vercel.app/">visit my website here</a>
      </div>
      <div className="btn-container">
        <button className="reload-btn" onClick={restartGame}>Restart Game</button>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      if (squares[a] === "X") {
        console.log("x is noted")
        return "X"
      }
      return "Bot"
    }
  }
  return null;
}

function getBotMove(squares) {
  // Winning Move
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] === "O" &&
      squares[a] === squares[b] &&
      squares[c] === null
    ) {
      return c;
    }
    if (
      squares[b] === "O" &&
      squares[b] === squares[c] &&
      squares[a] === null
    ) {
      return a;
    }
    if (
      squares[c] === "O" &&
      squares[c] === squares[a] &&
      squares[b] === null
    ) {
      return b;
    }
  }

  // Blocking Move
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a] === "X" &&
      squares[a] === squares[b] &&
      squares[c] === null
    ) {
      return c;
    }
    if (
      squares[b] === "X" &&
      squares[b] === squares[c] &&
      squares[a] === null
    ) {
      return a;
    }
    if (
      squares[c] === "X" &&
      squares[c] === squares[a] &&
      squares[b] === null
    ) {
      return b;
    }
  }

  // Center Move
  if (squares[4] === null) {
    return 4;
  }

  // Check if used has filled one of the corners
  const corners = [0, 2, 6, 8];
  const userCorners = corners.filter((corner) => squares[corner] === "X");
  if (userCorners.length > 0) {
    const corner = userCorners[0];
    const adjacentSquares = {
      0 : [1, 3],
      2 : [1, 5],
      6 : [3, 7],
      8 : [5, 7],
    };
    const emptyAdjacentSquares = adjacentSquares[corner].filter((square) => squares[square] === null);

    if (emptyAdjacentSquares.length > 0) {
      return emptyAdjacentSquares[0];
    }
  }

  // Corner Move
  const emptyCorners = corners.filter((corner) => squares[corner] === null);
  if (emptyCorners.length > 0) {
    return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
  }

  // Random Move
  const emptySquares = squares.reduce((acc, value, index) => {
    if (value === null) {
      acc.push(index);
    }
    return acc;
  }, []);
  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randomIndex];
}