'use client'
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;


// Cellular Automata implementation with controls built into the component 
function CellularAutomata({ interval = 100 }) {

    const generationProbability = useRef(null);
    const neighborRequirementAliveRef = useRef(null);
    const neighborRequirementDeadRef = useRef(null);
    const [grid, setGrid] = useState([]);
    const canvasRef = useRef(null);
    const [isRunning, setIsRunning]= useState(false);
    const [rows, setRows] = useState(60);
    const [cols, setCols] = useState(60);
    const minimumNeighborsIfAlive = neighborRequirementAliveRef.current?.value;
    const minimumNeighborsIfDead = neighborRequirementDeadRef.current?.value;

    // resets grid on rows & cols changing, and on site load
    useEffect(() => {
        setGrid(createGrid());
    }, [rows, cols]);

    // draws the grid everytime it changes
    useLayoutEffect(() => {
        if (canvasRef.current && grid.length) {
            const ctx = canvasRef.current.getContext('2d');
            drawGrid(ctx, grid);
        }
    }, [grid]);

    // handles the timer 
    useEffect(() => {
        if (isRunning) {
            const timer = setInterval(() => {
                if (isRunning) {
                    updateGrid();
                }
            }, interval);
            return () => clearInterval(timer);
        }
    }, [isRunning]);

    // creates the grid
    const createGrid = () => {
        return Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => Math.random() > generationProbability.current?.value ? 1 : 0)
        );
    }

    // handles resetting the grid
    const resetGrid = () => {
        setIsRunning(false);
        return setGrid(createGrid());
    }

    // updates grid based on alive / dead requirement
    const updateGrid = () => {
        setGrid(prevGrid => {
            return prevGrid.map((row, rowIdx) => 
                row.map((cell, colIdx) => {
                    const numNeighbors = getNeighbors(prevGrid, rowIdx, colIdx);
                    return cell === 1 && numNeighbors >= minimumNeighborsIfAlive || cell === 0 && numNeighbors >= minimumNeighborsIfDead ? 1 : 0;
                })
            );
        });
    }

    const getNeighbors = (grid, x, y) => {
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const newX = x + dx, newY = y + dy;
                if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
                    count += grid[newX][newY];
                }
            }
        }
        return count;
    }

    const drawGrid = (ctx, grid) => {
      let pixelWidth = CANVAS_WIDTH / cols;
      let pixelHeight = CANVAS_HEIGHT / rows;
        grid.forEach((row, i) => {
            row.forEach((cell, j) => {
                ctx.fillStyle = cell ? 'black' : 'white';
                ctx.fillRect(j * pixelWidth, i * pixelHeight, pixelWidth, pixelHeight); 
            });
        });
    }

    return (
        <div>
             <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ></canvas>
            <div className="bg-title-blue text-white py-2 px-4 rounded">
              Row Count:
              <input type= "number" style={{width: "80px"}} className="px-4 text-white bg-transparent" value={rows} onChange={(e) => setRows(Number(e.target.value))}/>
              <br></br>
              Column Count:
              <input type= "number" style={{width: "80px"}} className="px-4 text-white bg-transparent" value={cols} onChange={(e) => setCols(Number(e.target.value))}/>
              <br></br>
            Initial generation probability: 
                <input style={{width: "80px"}} ref={generationProbability} className="px-4 text-white bg-transparent" defaultValue = "0.4"></input>
            <br></br>
                Neighbor requirement for a cell to stay alive: 
                <input style={{width: "80px"}} ref={neighborRequirementAliveRef} className="px-4 text-white bg-transparent" defaultValue={3}/>
            <br></br>
                Neighbor requirement for a cell to turn alive: 
                <input style={{width: "80px"}} ref={neighborRequirementDeadRef} className="px-4 text-white bg-transparent" defaultValue={5}/>
            </div>
            <div className='w-full flex flex-col justify-center'>
                <br></br>
                <button className="bg-title-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setIsRunning(!isRunning)}>
                    {isRunning ? 'Stop' : 'Start'}
                </button>
                <button className="bg-title-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={resetGrid}>
                    Reset
                </button>
            </div>
           
        </div>
    );
}

export default CellularAutomata;
