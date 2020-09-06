import { dfs, bfs, astar } from "./pathfindingAlgorithms";
import {
  getAllNodes,
  getGridDeepCopy,
  getNeighbors,
  getShortestPathNodesInOrder,
  resetGridSearchProperties,
  isNeighbors,
  isValidCoordinates,
  fillPathGapsInNodeList,
  removeDuplicateNodes,
  shuffle,
} from "./algorithmUtils";

export const baseMap = (grid, map, dockingStation, availableSteps, step) => {
  let i = 0;
  const visitedNodesInOrder = [];

  let [currNode, pathToStartingNode] = pushPathToNewStartingNode(
    grid,
    map,
    dockingStation,
    visitedNodesInOrder,
    availableSteps
  );

  while (i < availableSteps - pathToStartingNode.length) {
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

  let [startNode, pathToStartingNode] = pushPathToNewStartingNode(
    grid,
    map,
    dockingStation,
    visitedNodesInOrder,
    availableSteps
  );

  const offsets = calculateSpiralTraversalOffsets(
    grid,
    availableSteps - pathToStartingNode.length
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

const randomOptimized = (currNode, map, grid) => {
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
  if (!neighbors.length || !neighbors) {
    alert("No neighbors found");
    return false;
  }
  const neighborsAscending = [...neighbors].sort(
    (n1, n2) => n1.visitCount - n2.visitCount
  );
  return neighborsAscending[0];
};

const pushPathToNewStartingNode = (
  grid,
  map,
  dockingStation,
  visitedNodesInOrder,
  availableSteps
) => {
  const pathToStartingNode = resolvePathToStartingNode(
    grid,
    map,
    dockingStation
  );
  if (
    isNewStartNodeRequiredAndAccessible(
      pathToStartingNode,
      availableSteps,
      dockingStation
    )
  ) {
    visitedNodesInOrder.push(...pathToStartingNode);
    const newStartingNode = pathToStartingNode[pathToStartingNode.length - 1];
    return [newStartingNode, pathToStartingNode];
  }
  return [dockingStation, []];
};

const isNewStartNodeRequiredAndAccessible = (
  pathToStartingNode,
  availableSteps,
  dockingStation
) => {
  return (
    pathToStartingNode.length &&
    availableSteps >= pathToStartingNode.length * 2 &&
    dockingStation.isMapped
  );
};

const resolvePathToStartingNode = (grid, map, dockingStation) => {
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

const adjustRobotPathToBatteryAndInsertReturnPath = (
  visitedNodesInOrder,
  map,
  dockingStation,
  availableSteps
) => {
  let t2 = performance.now();
  const runningMap = getGridDeepCopy(map);
  let t3 = performance.now();
  console.log("Call to getGridDeepCopy took " + (t3 - t2) + " milliseconds.");

  const startNodeRef = runningMap[dockingStation.row][dockingStation.col];
  /*     visitedNodesInOrder.forEach((visitedNode) => {
    const { row, col } = visitedNode;
    runningMap[row][col].isMapped = true;
  }); */
  /* 
  visitedNodes is calculated regardless of battery size (using the algorithm callback).
  we want to minimize the amount of iterations of this loop, so we start searching for a path
  back to the docking station starting from the node that corresponds to our current battery, backwards,
  until we find a complete path (mapping/sweeping + return to docking station).

  TODO:
  1. Consider removing isMapped consideration. we update the robot map in handlePlay function on visualizer.
  */

  const visitedNodesConsideringBattery = visitedNodesInOrder.slice(
    0,
    availableSteps
  );
  visitedNodesConsideringBattery.forEach(
    (node) => (runningMap[node.row][node.col].isMapped = true)
  );

  let counter = 0;
  let t0 = performance.now();
  for (
    let i = Math.min(
      availableSteps - 1,
      visitedNodesConsideringBattery.length - 1
    );
    i >= 1;
    i--
  ) {
    const node =
      runningMap[visitedNodesConsideringBattery[i].row][
        visitedNodesConsideringBattery[i].col
      ];
    const searchResult = astar(runningMap, node, startNodeRef, [
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
    ]);
    counter++;

    if (searchResult) {
      const pathToDockingStation = getShortestPathNodesInOrder(
        searchResult[searchResult.length - 1]
      );
      if (pathToDockingStation.length + i <= availableSteps) {
        const robotPath = visitedNodesInOrder
          .slice(0, i)
          .concat(pathToDockingStation);
        console.log("iteration " + counter);
        removeDuplicateNodes(robotPath);
        let t1 = performance.now();
        console.log(
          "loop in modifiyVisitedNodes took " + (t1 - t0) + " milliseconds."
        );
        return robotPath;
      }
    }
  }

  console.log(
    "error in adjustRobotPathToBatteryAndInsertReturnPath in GlobalContext"
  );
  return false;
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

/************************************************************** */

const depthMap = (grid, robotMap, startNode, availableSteps) => {
  const visitedNodesInOrder = [];

  let [currStartNode, pathFromDockToStartNode] = pushPathToNewStartingNode(
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

const adjList = (grid, map, dockingStation, availableSteps) => {
  const adjList = {};
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const node = grid[i][j];
      const edges = [];
      const neighbors = getNeighbors(node, grid).filter(
        (neighbor) => !neighbor.isWall
      );
      neighbors.forEach((neighbor) => {
        edges.push({
          u: node,
          v: neighbor,
          w: getWeight(node, neighbor),
        });
      });
      adjList[`${i}-${j}`] = edges;
    }
  }
  return adjList;
};

const getWeight = (n1, n2) => {
  return n1.isWall || n2.isWall || n1 === n2 ? null : n2.dust;
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
