import { astar } from "./pathfindingAlgorithms";
export const randomWalk = (grid, startNode, finishNode) => {
  if (!startNode || !finishNode || startNode === finishNode) {
    console.log("Bad parameters, unable to calculate path!");
    return false;
  }
  let i = 0;
  let currNode = startNode;
  const visitedNodesInOrder = [];
  while (i < 500) {
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
  if (!startNode || !finishNode || startNode === finishNode) {
    console.log("Bad parameters, unable to calculate path!");
    return false;
  }
  const stack = new Stack();
  const visitedNodesInOrder = [];
  stack.push(startNode);
  while (!stack.isEmpty()) {
    const currNode = stack.pop();
    if (currNode.isWall) continue;
    if (currNode === finishNode) return visitedNodesInOrder;
    if (!visitedNodesInOrder.includes(currNode))
      visitedNodesInOrder.push(currNode);
    const neighbours = getUnvisitedNeighbors(currNode, grid, order);
    neighbours.forEach((neighbour) => {
      console.log(neighbour);
      if (!visitedNodesInOrder.includes(neighbour)) {
        stack.push(neighbour);
        neighbour.previousNode = currNode;
      }
    });
  }
  return visitedNodesInOrder;
};

// comment in order to see changes in commit
// need to add a order - vertcal/horizontal - determined by the order that we push to stock (first left right or up down)
// need to change functions names
const mappingDfs = (grid, startNode) => {
  let countInOrderToStopInfinityRun = 0;
  if (!startNode) {
    console.log("Bad parameters, unable to calculate path!");
    return false;
  }

  const stack = new Stack();
  const visitedNodesInOrder = [];
  let parentNode = startNode;
  let currNode = startNode;
  console.log(currNode);
  currNode.previousNode = parentNode;
  stack.push(currNode);
  // visitedNodesInOrder.push(currNode);

  while (!stack.isEmpty() && countInOrderToStopInfinityRun !== 40) {
    countInOrderToStopInfinityRun += 1;

    parentNode = currNode;
    currNode = stack.pop();
    const neighbors = getNeighborsTom(currNode, grid);
    pushRelevantToStack(stack, neighbors, visitedNodesInOrder, currNode);

    if (!isPrevNodeTheParent(parentNode, currNode)) {
      let shortPathPtoC = astar(grid, parentNode, currNode);
      console.log(
        "finding shortest path from " +
          parentNode.row +
          "," +
          parentNode.col +
          " to-> " +
          currNode.row +
          "," +
          currNode.col +
          "..."
      );
      console.log(shortPathPtoC);
      //here we need to check that the battery is sufficient to go through this path and get back to the docking station
      //visitedNodesInOrder.push(shortPathPtoC);

      //function that goes from parent node to currNode only stepping on stepped nodes
      //using the
      //shortest path from parent to curr

      visitedNodesInOrder.push(...shortPathPtoC);
    }
    visitedNodesInOrder.push(currNode);
  }
  console.log(visitedNodesInOrder);
  return visitedNodesInOrder;
};

const pushRelevantToStack = (
  stack,
  neighbors,
  visitedNodesInOrder,
  currNode
) => {
  console.log(currNode);
  console.log(neighbors);
  neighbors.forEach((neighbour) => {
    if (!visitedNodesInOrder.includes(neighbour) && !stack.isIn(neighbour)) {
      neighbour.previousNode = currNode;
      stack.push(neighbour);
    }
  });
};

const isPrevNodeTheParent = (node1, node2) => {
  console.log("currNode=" + node2.row + "," + node2.col);
  console.log(
    "currNode.previousNode =" +
      node2.previousNode.row +
      "," +
      node2.previousNode.col
  );
  console.log("parentNode =" + node1.row + "," + node1.col);
  console.log("**************************************");
  return node2.previousNode === node1;
};

const getNeighborsTom = (node, grid) => {
  const neighbors = [];
  const { col, row } = node;

  if (row < grid.length - 1 && !grid[row + 1][col].isWall) {
    neighbors.push(grid[row + 1][col]);
  }
  if (row > 0 && !grid[row - 1][col].isWall) {
    neighbors.push(grid[row - 1][col]);
  }
  if (col > 0 && !grid[row][col - 1].isWall) {
    neighbors.push(grid[row][col - 1]);
  }
  if (col < grid[0].length - 1 && !grid[row][col + 1].isWall) {
    neighbors.push(grid[row][col + 1]);
  }
  return neighbors;
};

const getUnvisitedNeighbors = (node, grid, order) => {
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
  return neighbors;
  // return neighbors.filter((neighbor) => !neighbor.isVisited);
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

  isIn(itemToBeChecked) {
    return this.items.includes(itemToBeChecked);
  }
}

export const data = [
  {
    name: "Horizontal Mapping",
    shortened: "Horizontal",
    func: (grid, startNode) => mappingDfs(grid, startNode),
  },
  {
    name: "Vertical Mapping",
    shortened: "Vertical",
    func: (grid, startNode) => mappingDfs(grid, startNode),
  },
  {
    name: "Random Walk",
    shortened: "Random",
    func: randomWalk,
  },
];
