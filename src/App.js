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
