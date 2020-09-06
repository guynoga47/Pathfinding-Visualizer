export const DEFAULT_GRID_HEIGHT = 25;
export const DEFAULT_GRID_WIDTH = 50;

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
    distance: Infinity,
    dust: 0,
    heuristicDistance: Infinity,
    isWall: isWall,
    previousNode: null,
  };
};
