import React, { useState } from "react";
import Visualizer from "./PathfindingVisualizer/Components/Visualizer/Visualizer";
import NavBar from "./PathfindingVisualizer/Components/Navbar/NavBar.jsx";
import * as nonWeightedAlgorithms from "./PathfindingVisualizer/Algorithms/nonWeightedAlgorithms";
import * as weightedAlgorithms from "./PathfindingVisualizer/Algorithms/weightedAlgorithms";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./Theme.js";
import "./App.css";

const App = () => {
  const [activeAlgorithm, setActiveAlgorithm] = useState(undefined);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [clearWallsRequest, setClearWallsRequest] = useState({
    requested: false,
    cleared: true,
  });
  const [saveLayoutRequest, setSaveLayoutRequest] = useState({
    requested: false,
  });
  const [drawingMode, setDrawingMode] = useState("free");
  const algorithms = nonWeightedAlgorithms.data.concat(weightedAlgorithms.data);
  console.log("App rendering");

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <NavBar
          isRunning={isRunning}
          isFinished={isFinished}
          algorithms={algorithms}
          activeAlgorithm={activeAlgorithm}
          setActiveAlgorithm={setActiveAlgorithm}
          setClearWallsRequest={setClearWallsRequest}
          setSaveLayoutRequest={setSaveLayoutRequest}
          drawingMode={drawingMode}
          setDrawingMode={setDrawingMode}
        />
        <Visualizer
          activeAlgorithm={activeAlgorithm ? activeAlgorithm.func : undefined}
          isRunning={isRunning}
          isFinished={isFinished}
          isClearWallsRequested={clearWallsRequest}
          isSaveLayoutRequested={saveLayoutRequest}
          setClearWallsRequest={setClearWallsRequest}
          setSaveLayoutRequest={setSaveLayoutRequest}
          setIsRunning={setIsRunning}
          setIsFinished={setIsFinished}
          drawingMode={drawingMode}
        />
      </ThemeProvider>
    </div>
  );
};

export default App;
