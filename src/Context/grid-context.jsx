import { createContext } from "react";

export default createContext({
  state: {
    grid: [],
    availableSteps: undefined,
    simulationType: undefined,
    activeAlgorithm: undefined,
    editorScript: undefined,
    userAlgorithmResult: false,
    isFinished: false,
    isRunning: false,
    startNode: undefined,
    configLoaded: false,
  },

  robot: { map: [] },
  gridHeight: undefined,
  gridWidth: undefined,

  updateState: (key, value, callback, param) => {},
  loadConfiguration: (nextConfiguration) => {},
  saveConfiguration: () => {},
  resizeGrid: (height, callback) => {},
  resetGridKeepWalls: (callback, param) => {},
  getInitialGrid: () => {},
  isStartNode: (row, col) => {},
  convertBatteryCapacityToAvailableSteps: () => {},
  convertAvailableStepsToBatteryCapacity: () => {},
});
