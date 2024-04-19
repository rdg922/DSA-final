'use client'
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';

const PIXEL_SIZE = 1;


function CaveGeneratorCanvas({ rows = 2000, cols = 500, interval = 100 }) {
    const [grid, setGrid] = useState([]);
    const canvasRef = useRef(null);
    const isRunningRef = useRef(true);

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
        if (isRunningRef.current) {
            const timer = setInterval(() => {
                if (isRunningRef.current) {
                    updateGrid();
                }
            }, interval);
            return () => clearInterval(timer);
        }
    }, []);

    function createGrid() {
        return Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => Math.random() > 0.4 ? 1 : 0)
        );
    }

    function updateGrid() {
        setGrid(prevGrid => {
            return prevGrid.map((row, rowIdx) => 
                row.map((cell, colIdx) => {
                    const numNeighbors = getNeighbors(prevGrid, rowIdx, colIdx);
                    return cell === 1 && numNeighbors >= 4 || cell === 0 && numNeighbors >= 5 ? 1 : 0;
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
            <button onClick={() => isRunningRef.current = !isRunningRef.current}>
                {isRunningRef.current ? 'Stop' : 'Start'}
            </button>
            <canvas ref={canvasRef} width={cols * 4} height={rows * 4} ></canvas>
        </div>
    );
}

export default CaveGeneratorCanvas;
