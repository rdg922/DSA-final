'use client'
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

const PIXEL_SIZE = 1;


function CaveGeneratorCanvas({ rows = 1000, cols = 500, interval = 300 }) {
    const generationProbability = useRef(null);
    const neighborRequirementAliveRef = useRef(null);
    const neighborRequirementDeadRef = useRef(null);
    const [grid, setGrid] = useState([]);
    const canvasRef = useRef(null);
    const [isRunning, setIsRunning]= useState(false);

    const minimumNeighborsIfAlive = neighborRequirementAliveRef.current?.value;
    const minimumNeighborsIfDead = neighborRequirementDeadRef.current?.value;

    useEffect(() => {
        setGrid(createGrid());
    }, []);

    useLayoutEffect(() => {
        if (canvasRef.current && grid.length) {
            const ctx = canvasRef.current.getContext('2d');
            drawGrid(ctx, grid);
        }
    }, [grid]);

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

    function createGrid() {
        return Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => Math.random() > generationProbability.current?.value ? 1 : 0)
        );
    }

    function reset() {
        setIsRunning(false);
        return setGrid(createGrid());
    }

    function updateGrid() {
        setGrid(prevGrid => {
            return prevGrid.map((row, rowIdx) => 
                row.map((cell, colIdx) => {
                    const numNeighbors = getNeighbors(prevGrid, rowIdx, colIdx);
                    return cell === 1 && numNeighbors >= minimumNeighborsIfAlive || cell === 0 && numNeighbors >= minimumNeighborsIfDead ? 1 : 0;
                })
            );
        });
    }

    function getNeighbors(grid, x, y) {
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

    function drawGrid(ctx, grid) {
        grid.forEach((row, i) => {
            row.forEach((cell, j) => {
                ctx.fillStyle = cell ? 'black' : 'white';
                ctx.fillRect(j * PIXEL_SIZE, i * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE); // Assuming cell size is 5x5 pixels
            });
        });
    }

    return (
        <div>
            <div className="bg-blue-500 text-white py-2 px-4 rounded">
                Initial generation probability: 
                <input type="number" style={{width: "80px"}} ref={generationProbability} className="px-4 text-black bg-transparent" defaultValue={0.2}/> 
                <br></br>
                Neighbor requirement for a cell to stay alive:
                <input type="number" style={{width: "80px"}} ref={neighborRequirementDeadRef} className="px-4 text-black bg-transparent" defaultValue={6}/>
                <br></br>
                Neighbor requirement for a cell to turn alive:
                <input type="number" style={{width: "80px"}} ref={neighborRequirementDeadRef} className="px-4 text-black bg-transparent" defaultValue={3}/>
            </div>
            <div className='flex items-center justify-center'>
                <button onClick={reset} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Reset
                </button>
                <button onClick={() => setIsRunning(!isRunning)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {isRunning ? 'Stop' : 'Start'}
                </button>
            </div>
            <canvas className='flex items-center justify-center' ref={canvasRef} width={cols * PIXEL_SIZE} height={rows * PIXEL_SIZE} ></canvas>
        </div>
    );
}

export default CaveGeneratorCanvas;
