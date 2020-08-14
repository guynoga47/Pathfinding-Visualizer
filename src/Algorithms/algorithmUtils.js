export const getShortestPathNodesInOrder = (finishNode) => {
  const shortestPathInOrder = [];
  let currentNode = finishNode;
  if (!finishNode) {
    console.log("bad param in getShortestPathNodesInOrder");
    return false;
  }
  while (currentNode !== null) {
    shortestPathInOrder.unshift(currentNode);
    currentNode = currentNode.previousNode ? currentNode.previousNode : null;
  }
  return shortestPathInOrder;
};

export const getAllNodes = (grid) => {
  return [].concat(...grid);
};

export const isNeighbors = (n1, n2) => {
  return Math.abs(n1.row - n2.row) <= 1 && Math.abs(n1.col - n2.col) <= 1;
};

export const isValidCoordinates = (node, grid) => {
  return (
    node.row < grid.length &&
    node.row >= 0 &&
    node.col < grid[0].length &&
    node.col >= 0
  );
};

export const getNeighbors = (node, grid) => {
  const neighbors = [];
  const { col, row } = node;
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row > 0) neighbors.push(grid[row - 1][col]);
  return neighbors;
};

export const resetGridSearchProperties = (grid) => {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      grid[row][col].previousNode = null;
      grid[row][col].isVisited = false;
      grid[row][col].distance = Infinity;
      grid[row][col].heuristicDistance = Infinity;
    }
  }
};

export const getGridDeepCopy = (grid) => {
  const gridCopy = JSON.parse(JSON.stringify(grid));
  resetGridSearchProperties(gridCopy);
  return gridCopy;
};
