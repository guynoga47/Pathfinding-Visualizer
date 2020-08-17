import { bfs, astar } from "./pathfindingAlgorithms";
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
  const robotPath = modifyVisitedNodesConsideringBatteryAndReturnPath(
    visitedNodesInOrder,
    map,
    dockingStation,
    availableSteps
  );
  return robotPath;
};

export const breadthMapping = (grid, startNode) => {
  const bfsResult = bfs(grid, startNode);
  /*
  astar probably adds unwanted nodes because if are not respecting isMapped property in the astar implementation.
  */
  /* bfsResult.forEach((node) => (node.isMapped = true)); */
  let visitedNodesInOrder = [];
  let currentLocation = startNode;
  //assign bfs result nodes isMapped=true before applying astar and searching through mapped nodes.
  bfsResult.forEach((node) => {
    let astarResult = astar(grid, currentLocation, node, [
      { attribute: "isVisited", evaluation: false },
      { attribute: "isWall", evaluation: false },
    ]);
    let path = getShortestPathNodesInOrder(astarResult[astarResult.length - 1]);
    visitedNodesInOrder.push(...path);
    currentLocation = path[path.length - 1];
  });
  visitedNodesInOrder = bfsResult.slice(0, 250);
  return visitedNodesInOrder;
};

const spiralMap = (grid, map, dockingStation, availableSteps) => {
  const visitedNodesInOrder = [];

  /*   let [startNode, startingPathLength] = resolvePathToStartingNode(
    visitedNodesInOrder,
    grid,
    map,
    dockingStation
  ); */

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

  const robotPath = modifyVisitedNodesConsideringBatteryAndReturnPath(
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
      offsets.push({ row, col });
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
  if (!neighbors.length || !neighbors) {
    alert("No neighbors found");
  }
  const neighborsAscending = [...neighbors].sort(
    (n1, n2) => n1.visitCount - n2.visitCount
  );
  const neighborsDescending = [...neighbors].sort(
    (n1, n2) => n2.visitCount - n1.visitCount
  );
  const neighborsProbabilities = [];

  /* neighborsDescending.forEach((neighbor, i) => {
    for (let count = 0; count <= neighbor.visitCount; count++) {
      neighborsProbabilities.push(neighborsAscending[i]);
    }
  }); */
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
  if (availableSteps >= pathToStartingNode.length * 2) {
    visitedNodesInOrder.push(...pathToStartingNode);
    const newStartingNode = pathToStartingNode[pathToStartingNode.length - 1];
    return [newStartingNode, pathToStartingNode];
  }
  return [dockingStation, []];
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
        { attribute: "isVisited", evaluation: false },
        { attribute: "isWall", evaluation: false },
        { attribute: "isMapped", evaluation: true },
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

const modifyVisitedNodesConsideringBatteryAndReturnPath = (
  visitedNodesInOrder,
  map,
  dockingStation,
  availableSteps
) => {
  const runningMap = getGridDeepCopy(map);

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
      { attribute: "isVisited", evaluation: false },
      { attribute: "isWall", evaluation: false },
      { attribute: "isMapped", evaluation: true },
    ]);

    if (searchResult) {
      const pathToDockingStation = getShortestPathNodesInOrder(
        searchResult[searchResult.length - 1]
      );
      if (pathToDockingStation.length + i <= availableSteps) {
        const robotPath = visitedNodesInOrder
          .slice(0, i)
          .concat(pathToDockingStation);
        console.log("robotPath: ", robotPath);
        removeDuplicateNodes(robotPath);
        return robotPath;
      }
    }
  }
  console.log(
    "error in modifyVisitedNodesConsideringBatteryAndReturnPath in GlobalContext"
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

const dfs = (grid, startNode, finishNode, order) => {
  const stack = new Stack();
  const visitedNodesInOrder = [];
  stack.push(startNode);
  while (!stack.isEmpty()) {
    const currNode = stack.pop();
    if (currNode.isWall) continue;
    if (currNode === finishNode) return visitedNodesInOrder;
    if (!visitedNodesInOrder.includes(currNode))
      visitedNodesInOrder.push(currNode);
    let neighbors = getNeighbors(currNode, grid, order);
    neighbors = neighbors.filter((neighbor) => !neighbor.isVisited);
    neighbors.forEach((neighbor) => {
      if (!visitedNodesInOrder.includes(neighbor)) {
        stack.push(neighbor);
        neighbor.previousNode = currNode;
      }
    });
  }

  return visitedNodesInOrder;
};

class Stack {
  constructor() {
    this.items = [];
  }
  push(item) {
    this.items.push(item);
  }
  pop() {
    return this.items.length ? this.items.pop() : null;
  }
  peek() {
    return this.items.length ? this.items[this.items.length - 1] : null;
  }
  isEmpty() {
    return this.items.length === 0;
  }
  printStack() {
    this.items.forEach((item) => console.log(item));
  }
}

/************************************************************** */

const dfsHelper = (grid, roborMap, startNode, battery) => {
  let visitedIncludingJumps = dfs(grid, startNode);
  visitedIncludingJumps.push(startNode);
  const gridCopy = JSON.parse(JSON.stringify(grid));
  let visitedNodesInOrder = addShortPathBetweenUneighbours(
    visitedIncludingJumps,
    gridCopy
  );
  console.log(visitedNodesInOrder);
  return visitedNodesInOrder;
};

const areNeighbors = (node1, node2, gridCopy) => {
  let node1Neighbors = getNeighbors(node1, gridCopy);
  for (let i = 0; i < node1Neighbors.length; i++) {
    if (
      node1Neighbors[i].row === node2.row &&
      node1Neighbors[i].col === node2.col
    ) {
      return true;
    }
  }
  return false;
};

const addShortPathBetweenUneighbours = (visitedIncludingJumps, gridCopy) => {
  let fixedVisitedNodesInOrder = [];
  for (let i = 0; i < visitedIncludingJumps.length - 1; i++) {
    if (
      !areNeighbors(
        visitedIncludingJumps[i],
        visitedIncludingJumps[i + 1],
        gridCopy
      )
    ) {
      //find shortest path using astar
      let node1 =
        gridCopy[visitedIncludingJumps[i].row][visitedIncludingJumps[i].col];
      let node2 =
        gridCopy[visitedIncludingJumps[i + 1].row][
          visitedIncludingJumps[i + 1].col
        ];
      console.log(
        "i: " +
          i +
          " start node is: (" +
          visitedIncludingJumps[i].row +
          ", " +
          visitedIncludingJumps[i].col +
          ") finish node is: (" +
          visitedIncludingJumps[i + 1].row +
          ", " +
          visitedIncludingJumps[i + 1].col +
          ")"
      );
      let shortestPath = astar(
        gridCopy,
        node1,
        node2,
        //visitedIncludingJumps[i],
        //visitedIncludingJumps[i + 1],
        [
          { attribute: "isVisited", evaluation: false },
          { attribute: "isWall", evaluation: false },
        ]
      );
      fixedVisitedNodesInOrder.push(...shortestPath);
    } else {
      fixedVisitedNodesInOrder.push(visitedIncludingJumps[i]);
    }
  }
  // insert the last node - "complete the work"
  fixedVisitedNodesInOrder.push(visitedIncludingJumps[visitedIncludingJumps.length-1]);
  return fixedVisitedNodesInOrder;
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
    name: "DFS Traversal",
    shortened: "DFS",
    func: dfsHelper,
  },
];
