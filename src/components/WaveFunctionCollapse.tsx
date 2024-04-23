import React, { useRef, useEffect, useState } from 'react';

const DIM = 10;
const BLANK = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;
const LEFT = 4;

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

const rules = [
  [
    [BLANK, UP],
    [BLANK, RIGHT],
    [BLANK, DOWN],
    [BLANK, LEFT]
  ],
  [
    [RIGHT, LEFT, DOWN],
    [LEFT, UP, DOWN],
    [BLANK, DOWN],
    [RIGHT, UP, DOWN],
  ],
  [
    [RIGHT, LEFT, DOWN],
    [LEFT, UP, DOWN],
    [RIGHT, LEFT, UP],
    [BLANK, LEFT]
  ],
  [
    [BLANK, UP],
    [LEFT, UP, DOWN],
    [RIGHT, LEFT, UP],
    [RIGHT, UP, DOWN]
  ],
  [
    [RIGHT, LEFT, DOWN],
    [BLANK, RIGHT],
    [RIGHT, LEFT, UP],
    [UP, DOWN, RIGHT]
  ],
]

function Canvas() {
  const canvasRef = useRef(null);
  const [tiles, setTiles] = useState([]);
  const [grid, setGrid] = useState([]);
  const [isRunning, setIsRunning] = useState(false)
  const [gridWidth, setGridWidth] = useState(10);
  const [gridHeight, setGridHeight] = useState(10);

  // resets the grid on page load 
  useEffect(() => {
    resetGrid();
  }, []);

  // resets the grid 
  const resetGrid = () => {
    
    setIsRunning(false);

    const loadedTiles = [BLANK, UP, RIGHT, DOWN, LEFT].map(index =>
      new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = `tiles/${['blank', 'up', 'right', 'down', 'left'][index]}.png`;
      })
    );
    Promise.all(loadedTiles).then(setTiles);
    const initialGrid = Array.from({ length: gridHeight * gridWidth}, (_, i) => ({
      collapsed: i === 0,
      options: i === 0 ? [DOWN] : [BLANK, UP, RIGHT, DOWN, LEFT]
    }));
    setGrid(initialGrid);
  }

  useEffect(() => {
    const initialGrid = Array.from({ length: gridWidth * gridHeight }, (_, i) => ({
      collapsed: false,
      options: [BLANK, UP, RIGHT, DOWN, LEFT]
    }));
    setGrid(initialGrid);
  }, [gridWidth, gridHeight]);

  // handles the timer
  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        if (isRunning) updateGrid();
      }, 100)
      return () => clearInterval(timer);
    }
  }, [isRunning]);

  // Draw function
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const w = CANVAS_WIDTH / gridWidth;
    const h = CANVAS_HEIGHT / gridHeight;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    grid.forEach((cell, index) => {
      const x = (index % gridWidth) * w;
      const y = Math.floor(index / gridWidth) * h;
      if (cell.collapsed && tiles[cell.options[0]]) {
        ctx.drawImage(tiles[cell.options[0]], x, y, w, h);
      } else {
        ctx.fillStyle = 'black';
        ctx.strokeRect(x, y, w, h);
      }
    });
  }, [grid, tiles, gridWidth, gridHeight]);

  const updateGrid = () => {

    let collapsibleCells = grid.filter(cell => !cell.collapsed);
    if (collapsibleCells.length === 0) {
      setIsRunning(false)
      return; // All cells are collapsed; no further action needed
    }

    // Find the cell with the least options and collapse it
    collapsibleCells.sort((a, b) => a.options.length - b.options.length);
    let minOptionsCell = collapsibleCells[0];
    let randomOption = minOptionsCell.options[Math.floor(Math.random() * minOptionsCell.options.length)];
    minOptionsCell.collapsed = true;
    minOptionsCell.options = [randomOption];

    // Update the grid based on new collapses
    const updatedGrid = grid.map((cell, index) => {
      if (cell.collapsed) return cell; // Skip already collapsed cells

      const x = index % gridWidth;
      const y = Math.floor(index / gridHeight);
      const directions = ['up', 'down', 'right', 'left'];
      const deltas = { up: -gridWidth, down: gridWidth, right: 1, left: -1 };
      const ruleIndices = { up: 2, down: 0, right: 3, left: 1 };

      directions.forEach(dir => {
          const neighborIdx = index + deltas[dir];
          const neighbor = grid[neighborIdx];
          if (neighbor && neighbor.collapsed) {
            let validOptions = neighbor.options.flatMap(option => rules[option][ruleIndices[dir]]);
            cell.options = cell.options.filter(option => validOptions.includes(option));
          }
      });

      return cell;
    })
    setGrid(updatedGrid);
  };

  return (
    <div>
      <div>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </div>
    <div className="bg-title-blue text-white py-2 px-4 rounded">
      Row Count:
      <input type="number" style={{width: "80px"}} className="px-4 text-white bg-transparent" defaultValue={gridHeight} onChange={e => setGridHeight(Number(e.target.value))} />
     <br></br>
      Column Count:
     <input type="number" style={{width: "80px"}} className="px-4 text-white bg-transparent" defaultValue={gridWidth} onChange={e => setGridWidth(Number(e.target.value))} />
    </div>
    <div className='w-full flex flex-col justify-center'>
    <br></br>
      <button className="bg-title-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Stop" : "Start"}</button>
      <button className="bg-title-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={resetGrid}>Reset</button>
    </div>
    </div>
  );
}

export default Canvas;

