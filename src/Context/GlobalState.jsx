import React, { Component } from "react";

import GridContext from "./grid-context";
import {
  DEFAULT_GRID_HEIGHT,
  DEFAULT_GRID_WIDTH,
  calculateDefaultDockingStation,
  createNode,
} from "./GlobalStateUtils";
import { DEFAULT_EDITOR_MARKUP } from "../Components/Editor/code";
import Robot from "../Classes/Robot";
import { resetGridSearchProperties } from "../Algorithms/algorithmUtils";

import { saveAs } from "file-saver";
//Grid logical context, everything related to visualizing it is sitting
//in visualizer.jsx
class GlobalState extends Component {
  constructor(props) {
    super(props);
    this.gridHeight = DEFAULT_GRID_HEIGHT;
    this.gridWidth = DEFAULT_GRID_WIDTH;
    const defaultDockingStation = calculateDefaultDockingStation(
      this.gridHeight,
      this.gridWidth
    );
    this.state = {
      grid: [],
      availableSteps: this.gridHeight * this.gridWidth,
      simulationType: undefined,
      activeAlgorithm: undefined,
      editorScript: DEFAULT_EDITOR_MARKUP,
      editorSimulation: false,
      isFinished: false,
      isRunning: false,
      startNode: defaultDockingStation,
      configLoaded: false,
      drawMethod: "free",
      drawItem: "dust",
      request: "",
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.robot = new Robot(grid);
    this.setState({ grid });
  }

  resizeGrid = (height, callback, param) => {
    this.gridHeight = height;
    this.gridWidth = height * 2;
    const defaultDockingStation = calculateDefaultDockingStation(
      this.gridHeight,
      this.gridWidth
    );
    const grid = this.getInitialGrid();
    this.robot = new Robot(grid);
    this.setState(
      {
        grid,
        availableSteps: this.gridHeight * this.gridWidth,
        startNode: defaultDockingStation,
        simulationType: undefined,
        activeAlgorithm: undefined,
        isFinished: false,
        isRunning: false,
      },
      () => callback && callback(param)
    );
  };

  saveConfiguration = () => {
    const { grid, availableSteps, startNode, simulationType } = this.state;
    const { map } = this.robot;
    const blob = new Blob([
      JSON.stringify({
        grid,
        map,
        availableSteps,
        startNode,
        simulationType,
      }),
    ]);
    const [rows, cols] = [this.gridHeight, this.gridWidth];
    saveAs(
      blob,
      `Grid Snapshot ${rows}*${cols} ${new Date()
        .toLocaleDateString()
        .replace(/\./g, "-")} at ${new Date()
        .toLocaleTimeString()
        .replace(/:/g, ".")}.json`
    );
  };

  loadConfiguration = (config) => {
    const { grid, map, startNode, availableSteps, simulationType } = config;
    this.robot = new Robot(grid);
    this.robot.map = map;
    this.gridHeight = grid.length;
    this.gridWidth = grid[0].length;
    this.setState(
      {
        grid,
        availableSteps,
        startNode,
        simulationType,
        configLoaded: true,
      },
      () => {
        resetGridSearchProperties(this.state.grid);
        resetGridSearchProperties(this.robot.map);
      }
    );
  };

  saveUserScript = () => {
    const { editorScript } = this.state;
    const blob = new Blob([
      JSON.stringify({
        editorScript,
      }),
    ]);
    saveAs(
      blob,
      `User Script Snapshot ${new Date()
        .toLocaleDateString()
        .replace(/\./g, "-")} at ${new Date()
        .toLocaleTimeString()
        .replace(/:/g, ".")}.json`
    );
  };

  loadUserScript = (script) => {
    this.setState({
      editorScript: script,
    });
  };

  resetGridWithCurrentConfiguration = (callback, param) => {
    const grid = [];
    for (let row = 0; row < this.gridHeight; row++) {
      const currentRow = [];
      for (let col = 0; col < this.gridWidth; col++) {
        currentRow.push({ ...this.state.grid[row][col] });
      }
      grid.push(currentRow);
    }
    this.setState({ grid }, () => {
      callback && callback(param);
    });
  };

  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < this.gridHeight; row++) {
      const currentRow = [];
      for (let col = 0; col < this.gridWidth; col++) {
        currentRow.push(createNode(row, col));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  updateState = (key, value, callback, param) => {
    this.setState({ [key]: value }, () => {
      callback && callback(param);
    });

    //if the state update requires to run a function after state changes then we
    //will call this updateState with the callback, otherwise we wouldn't, so on
    //regular state updates we dont want to invoke undefined function.
  };

  isStartNode = (row, col) => {
    return row === this.state.startNode.row && col === this.state.startNode.col;
  };

  convertAvailableStepsToBatteryCapacity = (grid, availableSteps) => {
    /* We are using this function in relation to the current loaded configuration and also in the DataRow of Benchmark component,
    so we need to take care of both cases. */
    const currSteps = !availableSteps
      ? this.state.availableSteps
      : availableSteps;
    const gridHeight = !grid ? this.gridHeight : grid.length;
    const gridWidth = !grid ? this.gridWidth : grid[0].length;
    return Math.floor((currSteps / (gridHeight * gridWidth)) * 100);
  };

  convertBatteryCapacityToAvailableSteps = (battery) => {
    return Math.floor((battery / 100) * (this.gridHeight * this.gridWidth));
  };

  render() {
    return (
      <GridContext.Provider
        value={{
          state: this.state,
          robot: this.robot,
          isStartNode: this.isStartNode,
          convertBatteryCapacityToAvailableSteps: this
            .convertBatteryCapacityToAvailableSteps,
          convertAvailableStepsToBatteryCapacity: this
            .convertAvailableStepsToBatteryCapacity,
          updateState: this.updateState,
          getInitialGrid: this.getInitialGrid,
          resizeGrid: this.resizeGrid,
          saveConfiguration: this.saveConfiguration,
          loadConfiguration: this.loadConfiguration,
          saveUserScript: this.saveUserScript,
          loadUserScript: this.loadUserScript,
          resetGridWithCurrentConfiguration: this
            .resetGridWithCurrentConfiguration,
          gridHeight: this.gridHeight,
          gridWidth: this.gridWidth,
        }}
      >
        {this.props.children}
      </GridContext.Provider>
    );
  }
}

export default GlobalState;
