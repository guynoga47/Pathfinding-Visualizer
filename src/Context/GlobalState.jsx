import React, { Component } from "react";

import GridContext from "./grid-context";
import Robot from "../Classes/Robot";
import { resetGridSearchProperties } from "../Algorithms/algorithmUtils";

import { saveAs } from "file-saver";
//Grid logical context, everything related to visualizing it is sitting
//in visualizer.jsx
const DEFAULT_GRID_HEIGHT = 25;
const DEFAULT_GRID_WIDTH = 50;

const calculateDefaultDockingStation = (height, width) => {
  const defaultDockingStation = {
    row: Math.floor(height / 2),
    col: Math.floor(width / 2),
  };
  return defaultDockingStation;
};

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
      activeMappingAlgorithm: undefined,
      activeCleaningAlgorithm: undefined,
      userScript: `function buildPath(grid, map, dockingStation, availableSteps){
        grid[0][0].isWall = true;
        return [grid[0][0]];
     }`,
      isFinished: false,
      isRunning: false,
      startNode: defaultDockingStation,
      layoutLoaded: false,
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
        activeMappingAlgorithm: undefined,
        activeCleaningAlgorithm: undefined,
        isFinished: false,
        isRunning: false,
      },
      () => callback && callback(param)
    );
  };

  saveConfiguration = () => {
    const blob = new Blob([
      JSON.stringify({
        grid: this.state.grid,
        robot: this.robot,
        availableSteps: this.state.availableSteps,
        startNode: this.state.startNode,
        simulationType: this.state.simulationType,
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
    this.robot = new Robot(config.grid);
    this.robot.map = config.robot.map;
    this.gridHeight = config.grid.length;
    this.gridWidth = config.grid[0].length;
    this.setState(
      {
        grid: config.grid,
        availableSteps: config.availableSteps,
        startNode: config.startNode,
        simulationType: config.simulationType,
        layoutLoaded: true,
      },
      () => {
        resetGridSearchProperties(this.state.grid);
        resetGridSearchProperties(this.robot.map);
      }
    );
  };

  resetGridKeepWalls = (callback, param) => {
    const grid = [];
    for (let row = 0; row < this.gridHeight; row++) {
      const currentRow = [];
      for (let col = 0; col < this.gridWidth; col++) {
        currentRow.push(
          this.createNode(row, col, this.state.grid[row][col].isWall)
        );
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
        currentRow.push(this.createNode(row, col));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  createNode = (row, col, isWall = false) => {
    return {
      row,
      col,
      isStart: this.isStartNode(row, col),
      distance: Infinity,
      dust: 0,
      heuristicDistance: Infinity,
      isWall: isWall,
      previousNode: null,
    };
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

  convertAvailableStepsToBatteryCapacity = () => {
    return Math.floor(
      (this.state.availableSteps / (this.gridHeight * this.gridWidth)) * 100
    );
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
          loadConfiguration: this.loadConfiguration,
          saveConfiguration: this.saveConfiguration,
          resetGridKeepWalls: this.resetGridKeepWalls,
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
