const astar = (grid, startNode, finishNode) => {
  if (!startNode || !finishNode || startNode === finishNode) {
    console.log("Bad parameters, can't find path!");
    return false;
  }
  const visitedNodesInOrder = [];

  startNode.distance = 0;
  startNode.heuristicDistance = 0;

  const priorityQueue = [];
  priorityQueue.push(startNode);
  while (priorityQueue.length) {
    sortNodesByDistance(priorityQueue);
    const closestNode = priorityQueue.shift();
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === finishNode) {
      break;
    }

    const neighbors = getUnvisitedAccessibleNodes(closestNode, grid);
    for (const neighbor of neighbors) {
      //for single headed path visualization don't add weight to closestNode.distance.
      let tentativeWeightedDistance = closestNode.distance + 0; //+closestNode.weight
      if (tentativeWeightedDistance < neighbor.distance) {
        neighbor.distance = tentativeWeightedDistance;
        neighbor.heuristicDistance =
          neighbor.distance + manhattanDistance(neighbor, finishNode);
        neighbor.previousNode = closestNode;
        priorityQueue.push(neighbor);
      }
    }
  }
  visitedNodesInOrder.forEach((node) => (node.isVisited = false));
  return visitedNodesInOrder;
};

const manhattanDistance = (node, finishNode) => {
  //|x1-x2|+|y1-y2|
  return (
    Math.abs(node.col - finishNode.col) + Math.abs(node.row - finishNode.row)
  );
};

//check if we get undefined on function call since we are defining it as variable.
//so hoisting to undefined
const sortNodesByDistance = (unvisitedNodes) => {
  unvisitedNodes.sort(
    (nodeA, nodeB) => nodeA.heuristicDistance - nodeB.heuristicDistance
  );
};

const getUnvisitedAccessibleNodes = (node, grid) => {
  const neighbors = [];
  const { col, row } = node;
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row > 0) neighbors.push(grid[row - 1][col]);
  return neighbors.filter(
    (neighbor) => !neighbor.isVisited && !neighbor.isWall
  );
};

export const data = [
  {
    name: "A* Search",
    shortened: "A*",
    func: astar,
  },
  {
    name: "Dijkstra",
    shortened: "Dijkstra",
    func: undefined,
  },
];
