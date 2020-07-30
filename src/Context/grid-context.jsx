import { createContext } from "react";

export default createContext({
  grid: [],
  simulationType: undefined,
  activeMappingAlgorithm: undefined,
  activePathfindingAlgorithm: undefined,
  isRunning: false,
  isFinished: false,
  startNode: undefined,
  finishNode: undefined,

  loadLayout: (nextLayout) => {},
  updateState: (key, value, callback, param) => {},
  resizeGrid: (height, callback) => {},
  resetGridKeepWalls: (callback, param) => {},
  getInitialGrid: () => {},
  isStartNode: (row, col) => {},
  isFinishNode: (row, col) => {},
  convertBatteryCapacityToAvailableSteps: () => {},
  convertAvailableStepsToBatteryCapacity: () => {},
  getVisitedNodesConsideringBattery: (visitedNodesInOrder) => {},
});
