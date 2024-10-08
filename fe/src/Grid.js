import React, { useState } from 'react';
import './App.css';

const Grid = ({ size, start, end, path, setStart, setEnd }) => {
  const createGrid = () => {
    const grid = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        const point = { x: i, y: j };
        let className = 'cell';

        if (start && start.x === i && start.y === j) {
          className += ' start';
        } else if (end && end.x === i && end.y === j) {
          className += ' end';
        } else if (path.some(p => p.x === i && p.y === j)) {
          className += ' path';
        }

        row.push(
          <div
            key={`${i}-${j}`}
            className={className}
            onClick={() => handleCellClick(point)}
          />
        );
      }
      grid.push(<div className="row" key={i}>{row}</div>);
    }
    return grid;
  };

  const handleCellClick = (point) => {
    if (!start) {
      setStart(point);
    } else if (!end) {
      setEnd(point);
    }
  };

  return (
    <div className="grid">
      {createGrid()}
    </div>
  );
};

export default Grid;
