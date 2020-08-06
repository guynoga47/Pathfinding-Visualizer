import { bfs, astar } from "./pathfindingAlgorithms";
import {
  getAllNodes,
  getNeighbors,
  getShortestPathNodesInOrder,
} from "./algorithmUtils";

export const randomWalk = (grid, map, dockingStation, battery) => {
  /*   if (!startNode || !finishNode || startNode === finishNode) {
    console.log("Bad parameters, unable to calculate path!");
    return false;
  } */
  let i = 0;
  let currNode = !dockingStation.isMapped
    ? dockingStation
    : getRandomUnmappedNode(map, grid);
  if (!currNode) {
    currNode = dockingStation;
  }
  const visitedNodesInOrder = [];

  /* bound random walk number of iteration to a high enough number of steps according to grid size, trying to fully visit the grid might be very
  inefficient so we bound it artificially, regardless of the battery consideration which is taken care of as part of the play button handler in
  visualizer component.`*/
  while (i < battery) {
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

const getRandomUnmappedNode = (map, grid) => {
  const allNodes = getAllNodes(map);
  const mappedNodes = allNodes.filter((node) => node.isMapped);
  const unmappedMapAdjacentNodes = mappedNodes.filter((node) => {
    const mappedNeighbors = getNeighbors(node, grid).filter((neighbor) => {
      const { row, col } = neighbor;
      return !map[row][col].isMapped && !grid[row][col].isWall;
    });
    return mappedNeighbors.length > 0;
  });
  return unmappedMapAdjacentNodes.length > 0
    ? unmappedMapAdjacentNodes[
        Math.floor(Math.random() * unmappedMapAdjacentNodes.length)
      ]
    : false;
};

export const breadthMapping = (grid, startNode) => {
  const bfsResult = bfs(grid, startNode);
  const visitedNodesInOrder = [];
  let currentLocation = startNode;
  bfsResult.forEach((node) => {
    let astarResult = astar(grid, currentLocation, node);
    let path = getShortestPathNodesInOrder(astarResult[astarResult.length - 1]);
    visitedNodesInOrder.push(path);
  });
  return visitedNodesInOrder;
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
