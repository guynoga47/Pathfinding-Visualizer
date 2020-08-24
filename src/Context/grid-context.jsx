import { createContext } from "react";

export default createContext({
  grid: [],
  availableSteps: undefined,
  simulationType: undefined,
  activeMappingAlgorithm: undefined,
  activeCleaningAlgorithm: undefined,
  isRunning: false,
  isFinished: false,
  startNode: undefined,
  finishNode: undefined,

  loadConfiguration: (nextConfiguration) => { },
  saveConfiguration: () => { },
  updateState: (key, value, callback, param) => { },
  resizeGrid: (height, callback) => { },
  resetGridKeepWalls: (callback, param) => { },
  getInitialGrid: () => { },
  getGridDeepCopy: (grid) => { },
  isStartNode: (row, col) => { },
  isFinishNode: (row, col) => { },
  convertBatteryCapacityToAvailableSteps: () => { },
  convertAvailableStepsToBatteryCapacity: () => { },
});
