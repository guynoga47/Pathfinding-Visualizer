import { MAX_DISTANCE } from "../Algorithms/algorithmUtils";

export const DEFAULT_GRID_HEIGHT = 20;
export const DEFAULT_GRID_WIDTH = 40;

export const calculateDefaultDockingStation = (height, width) => {
  const defaultDockingStation = {
    row: Math.floor(height / 2),
    col: Math.floor(width / 2),
  };
  return defaultDockingStation;
};

export const createNode = (row, col, isWall = false) => {
  return {
    row,
    col,
    distance: MAX_DISTANCE,
    dust: 0,
    heuristicDistance: MAX_DISTANCE,
    isWall: isWall,
    previousNode: null,
  };
};
