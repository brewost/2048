import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const GridComponent = () => {
    const [gridData, setGridData] = useState([]);

    const initialiseGrid = () => {
      const newGrid = Array(4).fill(null).map(() => Array(4).fill(null));

      const getRandomPosition = () => ({
        row: Math.floor(Math.random() * 4),
        col: Math.floor(Math.random() * 4)
      });

      // Get first random position
      let { row: row1, col: col1 } = getRandomPosition();
      newGrid[row1][col1] = 2;

      // Get second random position, ensuring it is different from the first
      let { row: row2, col: col2 } = getRandomPosition();
      while (row1 === row2 && col1 === col2) {
        ({ row: row2, col: col2 } = getRandomPosition());
      }
      newGrid[row2][col2] = 2;

      // Set the grid data with the new grid
      setGridData(newGrid);
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
      let arr = row.filter(number => number);  // Remove all null values
      for (let i = 0; i < arr.length - 1; i++) {  // Combine numbers
        if (arr[i] === arr[i + 1]) {
          arr[i] *= 2;
          arr.splice(i + 1, 1);  // Remove the merged cell
        }
      }
      while (arr.length < 4) {  // Ensure each row has exactly 4 cells
        arr.push(null);
      }
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

    const updateGrid = (direction) => {
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

    

      setGridData(newGrid);
    };

    return (
     <section tabIndex="1" className="grid-wrapper" onKeyUp={handleKeyUp}>
      {gridData.map((row, x) => {
        return(
        row.map((cell, y) => {
          return <div className="  cell" key={x + "." + y} >{cell ? cell : ""}<span>{x + "." + y }</span></div>
        }))
      })}
    </section>
    );
  };

  return <GridComponent />;
}

export default App;

