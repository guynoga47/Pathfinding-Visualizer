import React, { Component } from "react";

import GridContext from "./grid-context";
//Grid logical context, everything related to visualizing it is sitting
//in visualizer.jsx
const DEFAULT_GRID_HEIGHT = 25;
const DEFAULT_GRID_WIDTH = 50;

const calculateDefaultGridEndPointsLocations = (height, width) => {
  const defaultStartNode = {
    row: Math.floor(height / 2),
    col: Math.floor(width / 5),
  };
  const defaultFinishNode = {
    row: Math.floor(height / 2),
    col: Math.floor((width * 4) / 5),
  };
  return { defaultStartNode, defaultFinishNode };
};

class GlobalState extends Component {
  constructor(props) {
    super(props);
    this.gridHeight = DEFAULT_GRID_HEIGHT;
    this.gridWidth = DEFAULT_GRID_WIDTH;
    const {
      defaultStartNode,
      defaultFinishNode,
    } = calculateDefaultGridEndPointsLocations(this.gridHeight, this.gridWidth);
    this.state = {
      grid: [],
      activeAlgorithm: undefined,
      isFinished: false,
      isRunning: false,
      startNode: defaultStartNode,
      finishNode: defaultFinishNode,
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid });
  }

  resizeGrid = (height, callback) => {
    this.gridHeight = height;
    console.log(callback);
    this.gridWidth = height * 2;
    const {
      defaultStartNode,
      defaultFinishNode,
    } = calculateDefaultGridEndPointsLocations(this.gridHeight, this.gridWidth);
    this.setState(
      { startNode: defaultStartNode, finishNode: defaultFinishNode },
      () => callback()
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
      callback(param);
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
      isFinish: this.isFinishNode(row, col),
      distance: Infinity,
      heuristicDistance: Infinity,
      isWall: isWall,
      previousNode: null,
    };
  };

  updateState = (key, value, callback, param) => {
    console.log("in updateState", key, value);
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

  isFinishNode = (row, col) => {
    return (
      row === this.state.finishNode.row && col === this.state.finishNode.col
    );
  };

  render() {
    return (
      <GridContext.Provider
        value={{
          state: this.state,
          isStartNode: this.isStartNode,
          isFinishNode: this.isFinishNode,
          updateState: this.updateState,
          getInitialGrid: this.getInitialGrid,
          resizeGrid: this.resizeGrid,
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
