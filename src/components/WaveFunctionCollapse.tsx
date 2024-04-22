import React, { useRef, useEffect, useState } from 'react';

const DIM = 10;
const BLANK = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;
const LEFT = 4;

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

  // Load tiles images
  useEffect(() => {
    const loadedTiles = [BLANK, UP, RIGHT, DOWN, LEFT].map(index =>
      new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = `tiles/${['blank', 'up', 'right', 'down', 'left'][index]}.png`;
      })
    );
    Promise.all(loadedTiles).then(setTiles);
    const initialGrid = Array.from({ length: DIM * DIM }, (_, i) => ({
      collapsed: i === 0,
      options: i === 0 ? [DOWN] : [BLANK, UP, RIGHT, DOWN, LEFT]
    }));
    setGrid(initialGrid);
  }, []);

  useEffect(() => {
    const initialGrid = Array.from({ length: gridWidth * gridHeight }, (_, i) => ({
      collapsed: false,
      options: [BLANK, UP, RIGHT, DOWN, LEFT]
    }));
    setGrid(initialGrid);
  }, [gridWidth, gridHeight]);

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
    const w = 800 / gridWidth;
    const h = 800 / gridHeight;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 800, 800);
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
  // This approach ensures that we are not mutating the original grid state directly

  let collapsibleCells = grid.filter(cell => !cell.collapsed);
  if (collapsibleCells.length === 0) {
    console.log("All cells have collapsed.");
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

    const x = index % DIM;
    const y = Math.floor(index / DIM);
    const directions = ['up', 'down', 'right', 'left'];
    const deltas = { up: -DIM, down: DIM, right: 1, left: -1 };
    const ruleIndices = { up: 2, down: 0, right: 3, left: 1 };

    directions.forEach(dir => {
      if ((dir === 'up' && y > 0) || (dir === 'down' && y < DIM - 1) || (dir === 'right' && x < DIM - 1) || (dir === 'left' && x > 0)) {
        const neighborIdx = index + deltas[dir];
        const neighbor = grid[neighborIdx];
        if (neighbor.collapsed) {
          let validOptions = neighbor.options.flatMap(option => rules[option][ruleIndices[dir]]);
          cell.options = cell.options.filter(option => validOptions.includes(option));
        }
      }
    });

    return cell;
  })
  setGrid(updatedGrid);
};

  return (
    <div>
     <input type="number" className="text-black" defaultValue={gridWidth} onChange={e => setGridWidth(Number(e.target.value))} />
      <input type="number" className="text-black" defaultValue={gridHeight} onChange={e => setGridHeight(Number(e.target.value))} />
      <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Stop" : "Continue"}</button>
      <canvas ref={canvasRef} width={800} height={800} />
      </div>
  );
}

export default Canvas;

