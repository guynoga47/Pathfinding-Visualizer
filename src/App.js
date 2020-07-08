import React, { useState } from "react";

import Visualizer from "./Components/Visualizer/Visualizer";
import NavBar from "./Components/Navbar/NavBar.jsx";
import * as nonWeightedAlgorithms from "./Algorithms/nonWeightedAlgorithms";
import * as weightedAlgorithms from "./Algorithms/weightedAlgorithms";

import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./Theme.js";
import "./App.css";

import GlobalState from "./Context/GlobalState.jsx";

const App = () => {
  const [clearWallsRequest, setClearWallsRequest] = useState({
    requested: false,
    cleared: true,
  });
  const [drawingMode, setDrawingMode] = useState("free");
  const algorithms = nonWeightedAlgorithms.data.concat(weightedAlgorithms.data);
  console.log("App rendering");

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <GlobalState>
          <NavBar
            algorithms={algorithms}
            setClearWallsRequest={setClearWallsRequest}
            drawingMode={drawingMode}
            setDrawingMode={setDrawingMode}
          />
          <Visualizer
            isClearWallsRequested={clearWallsRequest}
            setClearWallsRequest={setClearWallsRequest}
            drawingMode={drawingMode}
          />
        </GlobalState>
      </ThemeProvider>
    </div>
  );
};

export default App;

/* 
TODO
1. Make grid responsive, using material ui grid container and grid item maybe? 
2. Check edge cases when dragging end points (like when leaving grid and returning, or when dragging one endpoint over the other, 
  or trying to put end point on a wall, or clicking on end point etc)
3. Change icons for end points.
4. Deal with no path found case.
5. Shortest path draw is a bit choppy.
6. Add functionality to add weights, to support weighted search algorithms.


8. Remove ClearWalls, LoadLayout requests from Navbar to Visualizer.
9. useCallback equivalent in globalstate class?
10. try to define what should sit in the global state and what should sit in app.js/visualizer.js
11. implement load layout functionality (from tools.jsx)



*/
