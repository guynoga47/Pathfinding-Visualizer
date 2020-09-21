import { astar } from "./pathfindingAlgorithms";

export const MAX_DISTANCE = 9999;

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

export const isNeighbors = (node1, node2) => {
  return (
    (node1.row === node2.row && Math.abs(node1.col - node2.col) <= 1) ||
    (node1.col === node2.col && Math.abs(node1.row - node2.row) <= 1)
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
      grid[row][col].distance = MAX_DISTANCE;
      grid[row][col].heuristicDistance = MAX_DISTANCE;
    }
  }
};

export const getGridDeepCopy = (grid) => {
  const gridCopy = JSON.parse(JSON.stringify(grid));
  resetGridSearchProperties(gridCopy);
  return gridCopy;
};

export const fillPathGapsInNodeList = (
  map,
  nodeList,
  visitedNodesInOrder,
  filters
) => {
  if (!filters) {
    filters = [
      { attribute: "isVisited", evaluation: false },
      { attribute: "isWall", evaluation: false },
    ];
  }
  for (let i = 0; i < nodeList.length; i++) {
    const currNode = nodeList[i];
    const prevNode = i > 0 ? nodeList[i - 1] : currNode;
    if (!isNeighbors(currNode, prevNode)) {
      const path = astar(map, prevNode, currNode, filters);
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

export const adjList = (
  grid,
  filters = { attribute: "isWall", evaluation: false }
) => {
  const isValidNode = (node) => {
    let res = true;
    filters.forEach((filter) => {
      const { attribute, evaluation } = filter;
      if (node[attribute] !== evaluation) {
        res = false;
      }
    });
    return res;
  };
  const getWeight = (n1, n2) => {
    return n1.isWall || n2.isWall || n1 === n2 ? null : n2.dust;
  };
  const adjList = {};
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const node = grid[i][j];
      if (isValidNode(node)) {
        const edges = [];
        const neighbors = getNeighbors(node, grid).filter((node) =>
          isValidNode(node)
        );
        neighbors.forEach((neighbor) => {
          edges.push({
            u: node,
            v: neighbor,
            w: getWeight(node, neighbor),
          });
        });
        shuffle(edges);
        adjList[`${i}-${j}`] = edges;
      }
    }
  }
  return adjList;
};

//prettier-ignore

export const adjustRobotPathToBatteryAndInsertReturnPath = (visitedNodesInOrder,map,dockingStation,availableSteps,search = astar) => {
  /* 
  visitedNodes is calculated regardless of battery size (using the algorithm callback).
  we want to minimize the amount of iterations of this loop, so we start searching for a path
  back to the docking station starting from the node that corresponds to our current battery, backwards,
  until we find a complete path (mapping/sweeping + return to docking station).
  */
  const runningMap = getGridDeepCopy(map);

  const startNodeRef = runningMap[dockingStation.row][dockingStation.col];
  
  const filters = [
    {
      attribute: "isVisited",
      evaluation: false,
    },
    {
      attribute: "isWall",
      evaluation: false,
    },
    {
      attribute: "isMapped",
      evaluation: true,
    },
  ];

  const visitedNodesConsideringBattery = visitedNodesInOrder.slice(0,availableSteps);

  visitedNodesConsideringBattery.forEach((node) => (runningMap[node.row][node.col].isMapped = true));

  for (let i = Math.min(availableSteps - 1,visitedNodesConsideringBattery.length - 1); i >= 1; i--) {
    const node = runningMap[visitedNodesConsideringBattery[i].row][visitedNodesConsideringBattery[i].col];
    const pathToDockingStation = search(runningMap, node, startNodeRef, filters);

    if (pathToDockingStation && (pathToDockingStation.length + i <= availableSteps)) {
        const robotPath = visitedNodesInOrder
          .slice(0, i)
          .concat(pathToDockingStation);
        removeDuplicateNodes(robotPath);
        return robotPath;
      }
  }
  console.log(
    "error in adjustRobotPathToBatteryAndInsertReturnPath in GlobalContext"
  );
  return false;
};

export const isEqual = (node1, node2) => {
  return node1.row === node2.row && node1.col === node2.col;
};
