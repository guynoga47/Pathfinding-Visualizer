import { createContext } from "react";

export default createContext({
  state: {
    grid: [],
    availableSteps: undefined,
    simulationType: "",
    activeAlgorithm: undefined,
    editorScript: "",
    editorSimulation: {},
    isFinished: false,
    isRunning: false,
    startNode: undefined,
    configLoaded: false,
    drawItem: "",
    drawMethod: "",
    request: "",
  },

  robot: { map: [] },
  gridHeight: undefined,
  gridWidth: undefined,

  updateState: (key, value, callback, param) => {},
  loadConfiguration: (nextConfiguration) => {},
  saveConfiguration: () => {},
  resizeGrid: (height, callback) => {},
  resetGridWithCurrentConfiguration: (callback, param) => {},
  getInitialGrid: () => {},
  saveUserScript: () => {},
  loadUserScript: () => {},
  isStartNode: (row, col) => {},
  convertBatteryCapacityToAvailableSteps: () => {},
  convertAvailableStepsToBatteryCapacity: () => {},
});
