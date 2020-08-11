import { bfs, astar } from "./pathfindingAlgorithms";
import {
  getAllNodes,
  getNeighbors,
  getShortestPathNodesInOrder,
  resetGridSearchProperties,
} from "./algorithmUtils";

export const randomWalk = (grid, map, dockingStation, battery) => {
  let i = 0;
  const visitedNodesInOrder = [];

  let currNode = dockingStation;
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
      currNode = unmappedAreaBufferNode;
      pathToBufferNode = getShortestPathNodesInOrder(
        astarToBufferNodeResult[astarToBufferNodeResult.length - 1]
      );
      visitedNodesInOrder.push(
        ...pathToBufferNode.slice(0, pathToBufferNode.length)
      );
    }
  }

  resetGridSearchProperties(map);
  /* bound random walk number of iteration to a high enough number of steps according to grid size, trying to fully visit the grid might be very
  inefficient so we bound it artificially, regardless of the battery consideration which is taken care of as part of the play button handler in
  visualizer component.`*/
  while (i < battery - pathToBufferNode.length) {
    visitedNodesInOrder.push(currNode);
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

    neighborsDescending.forEach((neighbor, i) => {
      for (let count = 0; count <= neighbor.visitCount; count++) {
        neighborsProbabilities.push(neighborsAscending[i]);
      }
    });
    currNode =
      neighborsProbabilities[
        Math.floor(Math.random() * neighborsProbabilities.length)
      ];
    currNode.visitCount = !currNode.visitCount ? 1 : currNode.visitCount + 1;
    i++;
  }
  return visitedNodesInOrder;
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

export const breadthMapping = (grid, startNode) => {
  const bfsResult = bfs(grid, startNode);
  /*
  astar probably adds unwanted nodes because if are not respecting isMapped property in the astar implementation.
  */
  const visitedNodesInOrder = [];
  let currentLocation = startNode;
  bfsResult.forEach((node) => {
    let astarResult = astar(grid, currentLocation, node, [
      { attribute: "isVisited", evaluation: false },
      { attribute: "isWall", evaluation: false },
      { attribute: "isMapped", evaluation: true },
    ]);
    let path = getShortestPathNodesInOrder(astarResult[astarResult.length - 1]);
    visitedNodesInOrder.push(path);
  });
  return visitedNodesInOrder;
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
const mappingDfs = (grid, map, startNode, battery) => {
  let countInOrderToStopInfinityRun = 0;
  if (!startNode) {
    console.log("Bad parameters, unable to calculate path!");
    return false;
  }

  const stack = new Stack();
  const visitedNodesInOrder = [];
  let parentNode;
  let currNode = startNode;
  stack.push(currNode);

  while (!stack.isEmpty() && countInOrderToStopInfinityRun !== 40) {
    countInOrderToStopInfinityRun += 1;
    parentNode = currNode;
    currNode = stack.pop();
    const neighbors = getNeighborsTom(currNode, grid);
    pushRelevantToStack(stack, neighbors, visitedNodesInOrder, currNode);

    if (!isPrevNodeTheParent(parentNode, currNode) && parentNode !== currNode) {
      let shortPathPtoC = astar(grid, parentNode, currNode, [
        { attribute: "isVisited", evaluation: false },
        { attribute: "isWall", evaluation: false },
        { attribute: "isMapped", evaluation: true },
      ]);

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
    if (!didVisit(neighbour, visitedNodesInOrder) && !stack.isIn(neighbour)) {
      neighbour.previousNode = currNode;
      stack.push(neighbour);
    }
  });
};

const didVisit = (neighbor, visitedNodesInOrder) => {
  for (let i = 0; i < visitedNodesInOrder.length; i++) {
    if (
      visitedNodesInOrder[i].row === neighbor.row &&
      visitedNodesInOrder[i].col === neighbor.col
    )
      return true;
  }
  return false;
};

const isPrevNodeTheParent = (node1, node2) => {
  if (node1.previousNode !== null || node2.previousNode !== null) {
    console.log("currNode=" + node2.row + "," + node2.col);
    console.log(
      "currNode.previousNode =" +
        node2.previousNode.row +
        "," +
        node2.previousNode.col
    );
    console.log("parentNode =" + node1.row + "," + node1.col);
    console.log("**************************************");
  }
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
    func: mappingDfs,
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
