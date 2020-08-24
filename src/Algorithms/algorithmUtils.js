import { astar } from "./pathfindingAlgorithms";

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
  return (
    ((n1.row === n2.row && Math.abs(n1.col - n2.col) <= 1) ||
      (n1.col === n2.col && Math.abs(n1.row - n2.row) <= 1)) &&
    n1 !== n2
  );
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

export const fillPathGapsInNodeList = (map, nodeList, visitedNodesInOrder) => {
  for (let i = 0; i < nodeList.length; i++) {
    const currNode = nodeList[i];
    const prevNode = i > 0 ? nodeList[i - 1] : currNode;
    if (!isNeighbors(currNode, prevNode)) {
      console.log(
        `not neighbors found: node-${currNode.row}-${currNode.col}, node-${prevNode.row}-${prevNode.col}`
      );
      const astarResult = astar(map, prevNode, currNode, [
        { attribute: "isVisited", evaluation: false },
        { attribute: "isWall", evaluation: false },
      ]);
      const path = getShortestPathNodesInOrder(
        astarResult[astarResult.length - 1]
      );
      if (path) {
        visitedNodesInOrder.push(...path);
      } else {
        console.log(
          `could not fill path gap between node-${prevNode.row}-${prevNode.col} to node-${currNode.row}-${currNode.col}`
        );
      }
    } else {
      visitedNodesInOrder.push(currNode);
    }
  }
};

export const removeDuplicateNodes = (path) => {
  for (let i = 0; i < path.length - 1; i++) {
    if (path[i] === path[i + 1]) {
      path.splice(i, 1);
    }
  }
};

export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};
