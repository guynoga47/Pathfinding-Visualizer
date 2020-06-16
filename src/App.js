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
  const [clearWallsRequest, setClearWallsRequest] = useState({
    cleared: true,
    requested: false,
  });
  const algorithms = unweightedAlgorithms.data.concat(weightedAlgorithms.data);
  console.log("App rendering");

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <NavBar
          isRunning={isRunning}
          algorithms={algorithms}
          activeAlgorithm={activeAlgorithm}
          setActiveAlgorithm={setActiveAlgorithm}
          setClearWallsRequest={setClearWallsRequest}
        />
        <Visualizer
          activeAlgorithm={activeAlgorithm ? activeAlgorithm.func : undefined}
          isRunning={isRunning}
          isFinished={isFinished}
          isClearWallsRequested={clearWallsRequest}
          setClearWallsRequest={setClearWallsRequest}
          setIsRunning={setIsRunning}
          setIsFinished={setIsFinished}
        />
      </ThemeProvider>
    </div>
  );
};

export default App;
