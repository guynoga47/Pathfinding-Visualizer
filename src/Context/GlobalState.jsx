import React, { Component } from "react";

import GridContext from "./grid-context";
import Robot from "../Classes/Robot";

import { astar } from "../Algorithms/pathfindingAlgorithms";
import { getShortestPathNodesInOrder } from "../Algorithms/algorithmUtils";
//Grid logical context, everything related to visualizing it is sitting
//in visualizer.jsx
const DEFAULT_GRID_HEIGHT = 25;
const DEFAULT_GRID_WIDTH = 50;
const DEFAULT_CHARGE = 100;

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
      availableSteps: this.gridHeight * this.gridWidth,
      simulationType: undefined,
      activeMappingAlgorithm: undefined,
      activePathfindingAlgorithm: undefined,
      isFinished: false,
      isRunning: false,
      startNode: defaultStartNode,
      finishNode: defaultFinishNode,
      layoutLoaded: false,
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.robot = new Robot(DEFAULT_CHARGE, grid);
    this.setState({ grid });
  }

  resizeGrid = (height, callback, param) => {
    this.gridHeight = height;
    this.gridWidth = height * 2;
    const {
      defaultStartNode,
      defaultFinishNode,
    } = calculateDefaultGridEndPointsLocations(this.gridHeight, this.gridWidth);
    const grid = this.getInitialGrid();
    this.robot = new Robot(DEFAULT_CHARGE, grid);
    this.setState(
      {
        grid,
        startNode: defaultStartNode,
        finishNode: defaultFinishNode,
        isFinished: false,
      },
      () => callback && callback(param)
    );
  };

  loadLayout = (newLayout) => {
    this.setState(
      {
        grid: newLayout.grid,
        startNode: newLayout.startNode,
        finishNode: newLayout.finishNode,
        layoutLoaded: true,
      },
      this.resetNodesSearchProperties
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
      isFinish: this.isFinishNode(row, col),
      distance: Infinity,
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

  isFinishNode = (row, col) => {
    return (
      row === this.state.finishNode.row && col === this.state.finishNode.col
    );
  };

  convertAvailableStepsToBatteryCapacity = () => {
    return Math.floor(
      (this.state.availableSteps / (this.gridHeight * this.gridWidth)) * 100
    );
  };

  convertBatteryCapacityToAvailableSteps = (battery) => {
    return Math.floor((battery / 100) * (this.gridHeight * this.gridWidth));
  };

  modifyVisitedNodesConsideringBatteryAndReturnPath = (visitedNodesInOrder) => {
    let { startNode, availableSteps } = this.state;
    const runningMap = JSON.parse(JSON.stringify(this.robot.map));
    this.resetNodesSearchProperties(runningMap);
    const startNodeRef = runningMap[startNode.row][startNode.col];

    /* 
    visitedNodes is calculated regardless of battery size (using the algorithm callback).
    we want to minimize the amount of iterations of this loop, so we start searching for a path
    back to the docking station starting from the node that corresponds to our current battery, backwards,
    until we find a complete path (mapping/sweeping + return to docking station).
    */

    const visitedNodesConsideringBattery = visitedNodesInOrder.slice(
      0,
      availableSteps
    );
    visitedNodesConsideringBattery.forEach(
      (node) => (runningMap[node.row][node.col].isMapped = true)
    );

    for (let i = availableSteps - 1; i >= 1; i--) {
      const node = visitedNodesConsideringBattery[i];

      const searchResult = astar(runningMap, node, startNodeRef);

      if (searchResult) {
        const pathToDockingStation = getShortestPathNodesInOrder(
          searchResult[searchResult.length - 1]
        );
        if (pathToDockingStation.length + i <= availableSteps) {
          const robotPath = visitedNodesInOrder
            .slice(0, i)
            .concat(pathToDockingStation);
          this.robot.updateMap(robotPath);
          console.log(robotPath);
          console.log(pathToDockingStation);
          return robotPath;
        }
      }
      this.resetNodesSearchProperties(runningMap);
      runningMap[node.row][node.col].isMapped = false;
    }
    console.log(
      "error in modifyVisitedNodesConsideringBatteryAndReturnPath in GlobalContext"
    );
    return visitedNodesInOrder;
  };

  resetNodesSearchProperties = (grid) => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        grid[row][col].previousNode = null;
        grid[row][col].isVisited = false;
        grid[row][col].distance = Infinity;
        grid[row][col].heuristicDistance = Infinity;
      }
    }
  };

  render() {
    return (
      <GridContext.Provider
        value={{
          state: this.state,
          robot: this.robot,
          isStartNode: this.isStartNode,
          isFinishNode: this.isFinishNode,
          convertBatteryCapacityToAvailableSteps: this
            .convertBatteryCapacityToAvailableSteps,
          convertAvailableStepsToBatteryCapacity: this
            .convertAvailableStepsToBatteryCapacity,
          updateState: this.updateState,
          getInitialGrid: this.getInitialGrid,
          resizeGrid: this.resizeGrid,
          loadLayout: this.loadLayout,
          resetGridKeepWalls: this.resetGridKeepWalls,
          gridHeight: this.gridHeight,
          gridWidth: this.gridWidth,
          modifyVisitedNodesConsideringBatteryAndReturnPath: this
            .modifyVisitedNodesConsideringBatteryAndReturnPath,
        }}
      >
        {this.props.children}
      </GridContext.Provider>
    );
  }
}

export default GlobalState;
