import React from "react";

import Visualizer from "./Components/Visualizer/Visualizer";
import Controller from "./Components/Controller/Controller.jsx";

import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./Theme.js";
import "./App.css";

import GlobalState from "./Context/GlobalState.jsx";

const App = () => {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <GlobalState>
          <Controller />
          <Visualizer />
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


8. Remove ClearWallsRequest from Contrller to Visualizer.
9. Why visualizer reevaluates after visualizeShortestPath?
10. useCallback equivalent in globalstate class?
11. try to define what should sit in the global state and what should sit in app.js/visualizer.js
12. Design some mapping algorithms. (Horizontal Mapping, Vertical Mapping)



*/
