import React, { useState } from "react";
import PathfindingVisualizer from "./PathfindingVisualizer/PathfindingVisualizer";
import NavBar from "./PathfindingVisualizer/Components/Navbar/NavBar.jsx";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./Theme.js";
import "./App.css";

const App = () => {
  const [activeAlgorithm, setActiveAlgorithm] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <NavBar
          setActiveAlgorithm={setActiveAlgorithm}
          activeAlgorithm={activeAlgorithm.name}
        />
        <PathfindingVisualizer
          activeAlgorithm={activeAlgorithm.function}
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
