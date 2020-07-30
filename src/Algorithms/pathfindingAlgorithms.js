export const bfs = (grid, startNode, finishNode) => {
  /*   if (!startNode || !finishNode || startNode === finishNode) {
    console.log("Bad parameters, unable to calculate path!");
    return false;
  } */
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);
  const visitedNodesInOrder = [];
  while (unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();
    if (closestNode.isWall) continue;
    //need to find more elegant way to work on a copy of the array, maybe move grid to 1d array instead of 2d.
    if (closestNode.distance === Infinity) {
      visitedNodesInOrder.forEach((node) => (node.isVisited = false));
      return visitedNodesInOrder;
    }
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    //need to find more elegant way to work on a copy of the array, maybe move grid to 1d array instead of 2d.
    if (closestNode === finishNode) {
      visitedNodesInOrder.forEach((node) => (node.isVisited = false));
      return visitedNodesInOrder;
    }
    updateUnvisitedNeighborsDistances(closestNode, grid);
  }
};

//check if we get undefined on function call since we are defining it as variable.
//so hoisting to undefined
const sortNodesByDistance = (unvisitedNodes) => {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
};

const updateUnvisitedNeighborsDistances = (node, grid) => {
  const neighbors = getUnvisitedNeighbours(node, grid);
  for (const neighbor of neighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
};

const getUnvisitedNeighbours = (node, grid) => {
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

const getAllNodes = (grid) => {
  return [].concat(...grid);
};

const dfs = (grid, startNode, finishNode) => {
  /*   if (!startNode || !finishNode || startNode === finishNode) {
    console.log("Bad parameters, unable to calculate path!");
    return false;
  } */
  const stack = new Stack();
  const visitedNodesInOrder = [];
  stack.push(startNode);
  while (!stack.isEmpty()) {
    const currNode = stack.pop();
    if (currNode.isWall) continue;
    if (currNode === finishNode) return visitedNodesInOrder;
    if (!visitedNodesInOrder.includes(currNode))
      visitedNodesInOrder.push(currNode);
    const neighbours = getUnvisitedNeighbours(currNode, grid);
    neighbours.forEach((neighbour) => {
      if (!visitedNodesInOrder.includes(neighbour)) {
        stack.push(neighbour);
        neighbour.previousNode = currNode;
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

export const astar = (grid, startNode, finishNode) => {
  /*   if (!startNode || !finishNode || startNode === finishNode) {
    console.log("Bad parameters, unable to calculate path!");
    return false;
  } */
  console.log(grid, startNode, finishNode);

  const visitedNodesInOrder = [];
  startNode.distance = 0;
  startNode.heuristicDistance = 0;

  const priorityQueue = [];
  priorityQueue.push(startNode);
  while (priorityQueue.length) {
    sortNodesByHeuristicDistance(priorityQueue);
    const closestNode = priorityQueue.shift();
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === finishNode) {
      break;
    }

    const neighbors = getUnvisitedNeighbours(closestNode, grid);
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
  /*   visitedNodesInOrder.forEach((node) => {
    node.isVisited = false;
    node.distance = Infinity;
    node.heuristicDistance = Infinity;
    node.previousNode = null;
  }); */
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
const sortNodesByHeuristicDistance = (unvisitedNodes) => {
  unvisitedNodes.sort(
    (nodeA, nodeB) => nodeA.heuristicDistance - nodeB.heuristicDistance
  );
};

export const data = [
  {
    name: "Depth-first Search",
    shortened: "DFS",
    func: dfs,
  },
  {
    name: "Breadth-first Search",
    shortened: "BFS",
    func: bfs,
  },
  {
    name: "A* Search",
    shortened: "A*",
    func: astar,
  },
];
