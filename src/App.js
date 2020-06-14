import React, { useState, useEffect } from "react";
import PathfindingVisualizer from "./PathfindingVisualizer/PathfindingVisualizer";
import NavBar from "./PathfindingVisualizer/Components/Navbar/NavBar.jsx";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./Theme.js";
const App = () => {
  const [activeAlgorithm, setActiveAlgorithm] = useState({});
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <NavBar setActiveAlgorithm={setActiveAlgorithm} />
        <PathfindingVisualizer activeAlgorithm={activeAlgorithm.function} />
      </ThemeProvider>
    </div>
  );
};

export default App;
