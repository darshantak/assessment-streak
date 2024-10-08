import React, { useState } from 'react';
import Grid from './Grid';
import './App.css';

const App = () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);
  const resetAll = () => {
    setStart(null);
    setEnd(null);
    setPath([]);
  };
  
  const handleFindPath = () => {
    if (start && end) {
      // calling the BE api 
      console.log(JSON.stringify({ start, end }))
      fetch('http://localhost:3333/findpath', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start, end }),
      })
        .then((response) => response.json())
        .then((data) => {
          setPath(data.result_path);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      alert('Please set both start and end points.');
    }
  };

  return (
    <div className="app">
      <h1>DFS Pathfinding Visualizer</h1>
      <div className="controls">
        <button onClick={() => setStart(null)}>Reset Start</button>
        <button onClick={() => setEnd(null)}>Reset End</button>
        <button onClick={handleFindPath}>Find Path</button>
        <button onClick={resetAll}>Reset All</button>

      </div>
      <Grid size={4} start={start} end={end} path={path} setStart={setStart} setEnd={setEnd} />
    </div>
  );
};

export default App;
