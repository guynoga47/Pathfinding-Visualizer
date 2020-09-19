import { dfs, bfs, astar } from "./pathfindingAlgorithms";
import {
  getAllNodes,
  getNeighbors,
  getShortestPathNodesInOrder,
  resetGridSearchProperties,
  isNeighbors,
  isValidCoordinates,
  fillPathGapsInNodeList,
  adjustRobotPathToBatteryAndInsertReturnPath,
  shuffle,
} from "./algorithmUtils";

export const baseMap = (grid, map, dockingStation, availableSteps, step) => {
  let i = 0;
  const visitedNodesInOrder = [];

  let [currNode, pathToBorderNode] = extendToMapCurrentBorder(
    grid,
    map,
    dockingStation,
    visitedNodesInOrder,
    availableSteps
  );

  while (i < availableSteps - pathToBorderNode.length) {
    visitedNodesInOrder.push(currNode);

    currNode = step(currNode, map, grid);
    currNode.visitCount = !currNode.visitCount ? 1 : currNode.visitCount + 1;
    i++;
  }

  const robotPath = adjustRobotPathToBatteryAndInsertReturnPath(
    visitedNodesInOrder,
    map,
    dockingStation,
    availableSteps
  );

  return robotPath;
};

const spiralMap = (grid, map, dockingStation, availableSteps) => {
  const visitedNodesInOrder = [];

  let [startNode, pathToBorderNode] = extendToMapCurrentBorder(
    grid,
    map,
    dockingStation,
    visitedNodesInOrder,
    availableSteps
  );

  const offsets = calculateSpiralTraversalOffsets(
    grid,
    availableSteps - pathToBorderNode.length
  );

  const spiralOrderFromStartNode = [];
  offsets.forEach((offset) => {
    spiralOrderFromStartNode.push({
      row: startNode.row + offset.row,
      col: startNode.col + offset.col,
    });
  });

  const gridDimensionsLimitedCoords = spiralOrderFromStartNode.filter(
    (nodeCoord) => isValidCoordinates(nodeCoord, grid)
  );

  const accessibleNodes = bfs(map, dockingStation);

  const accessibleNodesCoords = gridDimensionsLimitedCoords.filter(
    (nodeCoord) => {
      const { row, col } = nodeCoord;
      return accessibleNodes.includes(map[row][col]);
    }
  );

  const spiralOrderNodes = [];

  accessibleNodesCoords.forEach((nodeCoord) => {
    spiralOrderNodes.push(map[nodeCoord.row][nodeCoord.col]);
  });

  fillPathGapsInNodeList(map, spiralOrderNodes, visitedNodesInOrder);

  const robotPath = adjustRobotPathToBatteryAndInsertReturnPath(
    visitedNodesInOrder,
    map,
    dockingStation,
    availableSteps
  );

  for (let i = 0; i < robotPath.length - 1; i++) {
    if (!isNeighbors(robotPath[i], robotPath[i + 1])) {
      console.log(
        `iteration ${i} node-${robotPath[i].row}-${robotPath[i].col}, node-${
          robotPath[i + 1].row
        }-${robotPath[i + 1].col}`
      );
    }
  }
  return robotPath;
};

const calculateSpiralTraversalOffsets = (grid, availableSteps) => {
  const offsets = [];
  let [row, col] = [0, 0];
  let [dirRow, dirCol] = [0, -1];
  let [numRows, numCols] = [grid.length, grid[0].length];
  for (let i = 0; i < availableSteps; i++) {
    if (
      -numRows / 2 < row &&
      row <= numRows / 2 &&
      -numCols / 2 < col &&
      col <= numCols / 2
    ) {
      offsets.push({
        row,
        col,
      });
    }
    if (
      row === col ||
      (row < 0 && row === -col) ||
      (row > 0 && row === 1 - col)
    ) {
      [dirRow, dirCol] = [-dirCol, dirRow];
    }
    [row, col] = [row + dirRow, col + dirCol];
  }
  return offsets;
};

export const randomOptimized = (currNode, map, grid) => {
  const neighbors = getNeighbors(currNode, map).filter(
    (neighbor) => !grid[neighbor.row][neighbor.col].isWall
  );

  /* shuffling neighbors to compensate for prioritizing certain paths 
  when dust is evenly distributed around the dockingStation (mostly went left and down) */

  shuffle(neighbors);
  const neighborsAscending = [...neighbors].sort(
    (n1, n2) => n1.visitCount - n2.visitCount
  );
  const neighborsDescending = [...neighbors].sort(
    (n1, n2) => n2.visitCount - n1.visitCount
  );
  const neighborsProbabilities = [];

  const multipliers = [70, 20, 5, 5];
  neighborsDescending.forEach((neighbor, i) => {
    for (let count = 0; count <= multipliers[i]; count++) {
      neighborsProbabilities.push(neighborsAscending[i]);
    }
  });

  return neighborsProbabilities[
    Math.floor(Math.random() * neighborsProbabilities.length)
  ];
};

const bestFirst = (currNode, map, grid) => {
  const neighbors = getNeighbors(currNode, map).filter(
    (neighbor) => !grid[neighbor.row][neighbor.col].isWall
  );

  const neighborsAscending = [...neighbors].sort(
    (n1, n2) => n1.visitCount - n2.visitCount
  );
  return neighborsAscending[0];
};

const extendToMapCurrentBorder = (
  grid,
  map,
  dockingStation,
  visitedNodesInOrder,
  availableSteps
) => {
  const pathToBorderNode = plotPathToBorderNode(grid, map, dockingStation);
  if (
    isBorderNodeRequiredAndAccesible(
      pathToBorderNode,
      availableSteps,
      dockingStation
    )
  ) {
    visitedNodesInOrder.push(...pathToBorderNode);
    const newStartingNode = pathToBorderNode[pathToBorderNode.length - 1];
    return [newStartingNode, pathToBorderNode];
  }
  return [dockingStation, []];
};

const isBorderNodeRequiredAndAccesible = (
  pathToBorderNode,
  availableSteps,
  dockingStation
) => {
  return (
    pathToBorderNode.length &&
    availableSteps >= pathToBorderNode.length * 2 &&
    dockingStation.isMapped
  );
};

const plotPathToBorderNode = (grid, map, dockingStation) => {
  let pathToBufferNode = [];
  const unmappedAreaBufferNode = getRandomBufferNode(map, grid);
  if (unmappedAreaBufferNode) {
    const astarToBufferNodeResult = astar(
      map,
      dockingStation,
      unmappedAreaBufferNode,
      [
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
      ]
    );
    pathToBufferNode = [];
    if (astarToBufferNodeResult) {
      pathToBufferNode = getShortestPathNodesInOrder(
        astarToBufferNodeResult[astarToBufferNodeResult.length - 1]
      );
    }
  }
  resetGridSearchProperties(map);
  return pathToBufferNode;
};

const getRandomBufferNode = (map, grid) => {
  const allNodes = getAllNodes(map);
  const mappedNodes = allNodes.filter((node) => node.isMapped);
  const unmappedMapAdjacentNodes = mappedNodes.filter((node) => {
    const unmappedNeighbors = getNeighbors(node, grid).filter((neighbor) => {
      const { row, col } = neighbor;
      return !map[row][col].isMapped && !grid[row][col].isWall;
    });
    return unmappedNeighbors.length > 0;
  });
  return unmappedMapAdjacentNodes.length > 0
    ? unmappedMapAdjacentNodes[
        Math.floor(Math.random() * unmappedMapAdjacentNodes.length)
      ]
    : false;
};

const depthMap = (grid, robotMap, startNode, availableSteps) => {
  const visitedNodesInOrder = [];

  let [currStartNode, pathFromDockToStartNode] = extendToMapCurrentBorder(
    robotMap,
    robotMap,
    startNode,
    visitedNodesInOrder,
    availableSteps
  );

  availableSteps = availableSteps - pathFromDockToStartNode.length;

  let dfsResult = dfs(robotMap, currStartNode);

  const robotPath = [];
  fillPathGapsInNodeList(robotMap, dfsResult, robotPath);

  visitedNodesInOrder.push(...robotPath);

  resetGridSearchProperties(robotMap);
  /*
  we reset grid properties because modifyVisitedNodes tries to deepcopy the map it gets. after astar the previousNodes
  in some nodes of the map are pointing to other nodes, so we actually deep copying much more objects then we intend to, 
  causing a huge unnessecary delay.
   */
  let visitedConsideringBattery = adjustRobotPathToBatteryAndInsertReturnPath(
    visitedNodesInOrder,
    robotMap,
    startNode,
    availableSteps
  );

  return visitedConsideringBattery;
};

export const data = [
  {
    name: "Random Traversal",
    shortened: "Random",
    func: (grid, map, dockingStation, availableSteps) =>
      baseMap(grid, map, dockingStation, availableSteps, randomOptimized),
  },
  {
    name: "Best First Traversal",
    shortened: "Best First",
    func: (grid, map, dockingStation, availableSteps) =>
      baseMap(grid, map, dockingStation, availableSteps, bestFirst),
  },
  {
    name: "Spiral Traversal",
    shortened: "Spiral",
    func: spiralMap,
  },
  {
    name: "Depth Traversal",
    shortened: "Depth",
    func: depthMap,
  },
];
