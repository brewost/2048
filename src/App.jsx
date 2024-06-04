import { useState, useEffect } from 'react';
import './App.css';



const imageMapping = {
  2: 'images/2.jpg',
  4: 'images/4.jpg',
  8: 'images/8.jpg',
  16: 'images/16.jpg',
  32: 'images/32.jpg',
  64: 'images/64.jpg',
  128: 'images/128.jpg',
  256: 'images/256.jpg',
  512: 'images/512.jpg',
  1024: 'images/1024.jpg',
  2048: 'images/2048.jpg',
  4096: 'images/4096.jpg',
  8192: 'images/8912.jpg',
  16384: 'images/16384.jpg',
  32768: 'images/32768.jpg'

};
function App() {
  const [gridData, setGridData] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initialiseGrid = () => {
    const newGrid = Array(4).fill(null).map(() => Array(4).fill(null));

    const getRandomPosition = () => ({
      row: Math.floor(Math.random() * 4),
      col: Math.floor(Math.random() * 4)
    });

    let { row: row1, col: col1 } = getRandomPosition();
    newGrid[row1][col1] = 2;

    let { row: row2, col: col2 } = getRandomPosition();
    while (row1 === row2 && col1 === col2) {
      ({ row: row2, col: col2 } = getRandomPosition());
    }
    newGrid[row2][col2] = 2;

    setGridData(newGrid);
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    initialiseGrid();
  }, []);

  const handleKeyUp = (e) => {
    if (!["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"].includes(e.code)) return;
    const direction = e.code.replace('Arrow', '');
    updateGrid(direction);
  };

  const slideRow = (row) => {
    let newScore = 0;
    let arr = row.filter(number => number);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        newScore += arr[i];
        arr.splice(i + 1, 1);
      }
    }
    while (arr.length < 4) {
      arr.push(null);
    }
    setScore(prevScore => prevScore + newScore);
    return arr;
  };

  const transpose = (matrix) => {
    let transposed = [];
    for (let i = 0; i < matrix.length; i++) {
      transposed[i] = [];
      for (let j = 0; j < matrix[i].length; j++) {
        transposed[i][j] = matrix[j][i];
      }
    }
    return transposed;
  };

  const addRandomTile = (grid) => {
    const emptyCells = [];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (!grid[i][j]) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length === 0) return grid;

    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[randomCell.row][randomCell.col] = Math.random() < 0.95 ? 2 : 4;

    return grid;
  };

  const updateGrid = (direction) => {
    if (gameOver) return;

    let newGrid = [...gridData];

    if (direction === "Left" || direction === "Right") {
      if (direction === "Right") {
        newGrid = newGrid.map(row => slideRow(row.slice().reverse()).reverse());
      } else {
        newGrid = newGrid.map(row => slideRow(row));
      }
    } else if (direction === "Up" || direction === "Down") {
      newGrid = transpose(newGrid);
      if (direction === "Down") {
        newGrid = newGrid.map(row => slideRow(row.slice().reverse()).reverse());
      } else {
        newGrid = newGrid.map(row => slideRow(row));
      }
      newGrid = transpose(newGrid);
    }
    
    newGrid = addRandomTile(newGrid);
    setGridData(newGrid);

    if (checkGameOver(newGrid)) {
      setGameOver(true);
    }
  };

  const checkGameOver = (grid) => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === null) {
          return false;
        }
      }
    }

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (i > 0 && grid[i][j] === grid[i - 1][j]) return false;
        if (i < grid.length - 1 && grid[i][j] === grid[i + 1][j]) return false;
        if (j > 0 && grid[i][j] === grid[i][j - 1]) return false;
        if (j < grid[i].length - 1 && grid[i][j] === grid[i][j + 1]) return false;
      }
    }

    return true;
  };

  const startGame = () => {
    initialiseGrid();
  };

  return (
    <section tabIndex="1" className="grid-wrapper" onKeyUp={handleKeyUp}>
      {gridData.map((row, x) => {
        return (
          row.map((cell, y) => {
            return (
              <div className="cell" key={x + "." + y}>
                {cell ? <img src={imageMapping[cell]} alt={`Tile ${cell}`} /> : ""}
              </div>
            );
          })
        );
      })}
      <div className="score">Score: {score}</div>
      {gameOver && <div className="game-over">Game Over!</div>}
      <button onClick={startGame} className="start-button">REGENERATE</button>
    </section>
  );
}

export default App;

