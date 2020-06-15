import React, { useState } from "react";
import Visualizer from "./PathfindingVisualizer/Components/Visualizer/Visualizer";
import NavBar from "./PathfindingVisualizer/Components/Navbar/NavBar.jsx";
import * as unweightedAlgorithms from "./PathfindingVisualizer/Algorithms/unweightedAlgorithms";
import * as weightedAlgorithms from "./PathfindingVisualizer/Algorithms/weightedAlgorithms";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./Theme.js";
import "./App.css";

const App = () => {
  const [activeAlgorithm, setActiveAlgorithm] = useState(undefined);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const algorithms = unweightedAlgorithms.data.concat(weightedAlgorithms.data);
  console.log("App rendering");
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <NavBar
          algorithms={algorithms}
          activeAlgorithm={activeAlgorithm}
          setActiveAlgorithm={setActiveAlgorithm}
        />
        <Visualizer
          activeAlgorithm={activeAlgorithm ? activeAlgorithm.func : undefined}
          isRunning={isRunning}
          isFinished={isFinished}
          setIsRunning={setIsRunning}
          setIsFinished={setIsFinished}
        />
      </ThemeProvider>
    </div>
  );
};

export default App;
