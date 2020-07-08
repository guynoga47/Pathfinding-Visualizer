import { createContext } from "react";

export default createContext({
  grid: [],
  activeAlgorithm: undefined,
  isRunning: false,
  isFinished: false,
  startNode: undefined,
  finishNode: undefined,

  loadLayout: (nextGrid) => {},
  updateState: (key, value, callback, param) => {},
  resizeGrid: (height, callback) => {},
  resetGridKeepWalls: (callback, param) => {},
  getInitialGrid: () => {},
  isStartNode: (row, col) => {},
  isFinishNode: (row, col) => {},
});