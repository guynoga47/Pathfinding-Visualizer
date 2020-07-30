export const randomWalk = (grid, startNode) => {
  /*   if (!startNode || !finishNode || startNode === finishNode) {
    console.log("Bad parameters, unable to calculate path!");
    return false;
  } */
  let i = 0;
  let currNode = startNode;
  const visitedNodesInOrder = [];
  /* const stepsBoundary = grid.length * grid[0].length; */
  const stepsBoundary = grid.length * grid[0].length;
  /* bound random walk number of iteration to a high enough number of steps according to grid size, trying to fully visit the grid might be very
  inefficient so we bound it artificially, regardless of the battery consideration which is taken care of as part of the play button handler in
  visualizer component.`*/
  while (i < stepsBoundary) {
    visitedNodesInOrder.push(currNode);
    const neighbors = getNeighbors(currNode, grid);
    if (!neighbors.length || !neighbors) {
      alert("No neighbors found");
    }
    currNode = neighbors[Math.floor(Math.random() * neighbors.length)];
    i++;
  }
  return visitedNodesInOrder;
};

const getNeighbors = (node, grid) => {
  const neighbors = [];
  const { col, row } = node;
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row > 0) neighbors.push(grid[row - 1][col]);
  return neighbors.filter((neighbor) => !neighbor.isWall);
};

const dfs = (grid, startNode, finishNode, order) => {
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
    const neighbours = getUnvisitedNeighbours(currNode, grid, order);
    neighbours.forEach((neighbour) => {
      if (!visitedNodesInOrder.includes(neighbour)) {
        stack.push(neighbour);
        neighbour.previousNode = currNode;
      }
    });
  }
  console.log(visitedNodesInOrder);
  return visitedNodesInOrder;
};

const getUnvisitedNeighbours = (node, grid, order) => {
  const neighbors = [];
  const { col, row } = node;
  if (order === "vertical") {
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (row > 0) neighbors.push(grid[row - 1][col]);
  }
  if (order === "horizontal") {
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  }
  return neighbors.filter((neighbor) => !neighbor.isVisited);
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

export const data = [
  {
    name: "Horizontal Mapping",
    shortened: "Horizontal",
    func: (grid, startNode, finishNode) =>
      dfs(grid, startNode, finishNode, "horizontal"),
  },
  {
    name: "Vertical Mapping",
    shortened: "Vertical",
    func: (grid, startNode, finishNode) =>
      dfs(grid, startNode, finishNode, "vertical"),
  },
  {
    name: "Random Walk",
    shortened: "Random",
    func: randomWalk,
  },
];
