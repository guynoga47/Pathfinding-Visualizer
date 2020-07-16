export const randomWalk = (grid, startNode, finishNode) => {
  if (!startNode || !finishNode || startNode === finishNode) {
    console.log("Bad parameters, unable to calculate path!");
    return false;
  }
  let i = 0;
  let currNode = startNode;
  const visitedNodesInOrder = [];
  while (i < 2000) {
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
  const {
    col,
    row
  } = node;
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  if (row > 0) neighbors.push(grid[row - 1][col]);
  return neighbors.filter((neighbor) => !neighbor.isWall);
};

const dfs = (grid, startNode, finishNode, order) => {
  // if (!startNode || !finishNode || startNode === finishNode) {
  //   console.log("Bad parameters, unable to calculate path!");
  //   return false;
  // }
  // const stack = new Stack();
  // const visitedNodesInOrder = [];
  // stack.push(startNode);
  // while (!stack.isEmpty()) {
  //   const currNode = stack.pop();
  //   // console.log("this is currNode");
  //   // console.log(currNode);
  //   if (currNode.isWall) continue;
  //   if (currNode === finishNode) return visitedNodesInOrder;
  //   if (!visitedNodesInOrder.includes(currNode))
  //     visitedNodesInOrder.push(currNode);
  //   const neighbours = getUnvisitedNeighbours(currNode, grid, order);
  //   neighbours.forEach((neighbour) => {
  //     console.log(neighbour);
  //     if (!visitedNodesInOrder.includes(neighbour)) {
  //       stack.push(neighbour);
  //       neighbour.previousNode = currNode;
  //     }
  //   });
  // }
  // return visitedNodesInOrder;
  return newDfs(grid, startNode, finishNode);
};

const newDfs = (grid, startNode, finishNode) => {
  if (!startNode || !finishNode || startNode === finishNode) {
    console.log("Bad parameters, unable to calculate path!");
    return false;
  }
  let parentNode = startNode;
  const stack = new Stack();
  const visitedNodesInOrder = [];
  stack.push(startNode);
  let currNode = startNode;
  currNode.previousNode = parentNode;

  while (!stack.isEmpty()) {
    parentNode = currNode;
    currNode = stack.pop();

    if (!isPrevNodeANeighbor(parentNode, currNode)) {
      //shortest path from parent to curr
      console.log("finding shortest path from " + parentNode.row + "," + parentNode.col + " to-> " + currNode.row + "," + currNode.col + "...");
    }
    // needs to be else term
    if (!visitedNodesInOrder.includes(currNode))
      visitedNodesInOrder.push(currNode);
    const neighbours = getNeighboursTom(currNode, grid);
    neighbours.forEach((neighbour) => {
      if (!visitedNodesInOrder.includes(neighbour)) {
        stack.push(neighbour);
      }
      neighbour.previousNode = currNode;
    });
  }
  console.log(visitedNodesInOrder);
  return visitedNodesInOrder;
};

const isPrevNodeANeighbor = (node1, node2) => {
  console.log("currNode=" + node2.row + "," + node2.col);
  console.log("currNode.previousNode =" + node2.previousNode.row + "," + node2.previousNode.col);
  console.log("parentNode =" + node1.row + "," + node1.col)
  console.log("**************************************");
  return (node2.previousNode === node1);
}


const experimentalDfs = (grid, node, in_visitedNodesInOrder) => {
  // get all 4 neighbours - [0]=right,[1]=left,[2]=up,[3]=down
  // if there near a wall or end of grid then [wall/grid]=null;
  const currNeighbours = getNeighboursTom(node);

  const neighbors = getNeighbors(node);
  const visitedNodesInOrder = in_visitedNodesInOrder;
  visitedNodesInOrder.push(node);

  return visitedNodesInOrder;
};

const getNeighboursTom = (node, grid) => {
  const neighbors = [];
  const {
    col,
    row
  } = node;

  if (row < grid.length - 1 && !grid[row + 1][col].isWall) {
    neighbors.push(grid[row + 1][col]);
  }
  if ((row > 0 && !grid[row - 1][col].isWall)) {
    neighbors.push(grid[row - 1][col]);
  }
  if (col > 0 && !grid[row][col - 1].isWall) {
    neighbors.push(grid[row][col - 1]);
  }
  if (col < grid[0].length - 1 && !grid[row][col + 1].isWall) {
    neighbors.push(grid[row][col + 1]);
  }
  return neighbors;
}

const getUnvisitedNeighbours = (node, grid, order) => {
  const neighbors = [];
  const {
    col,
    row
  } = node;
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
}

export const data = [{
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