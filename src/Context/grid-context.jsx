import { createContext } from "react";

export default createContext({
  grid: [],
  availableSteps: undefined,
  simulationType: undefined,
  activeMappingAlgorithm: undefined,
  activePathfindingAlgorithm: undefined,
  isRunning: false,
  isFinished: false,
  startNode: undefined,
  finishNode: undefined,

  loadConfiguration: (nextConfiguration) => {},
  saveConfiguration: () => {},
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
